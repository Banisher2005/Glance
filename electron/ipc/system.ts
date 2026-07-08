import { ipcMain, powerMonitor } from 'electron';
import si from 'systeminformation';

export interface SystemSnapshot {
  cpu: { load: number; cores: number[]; speedGhz: number };
  memory: { usedGb: number; totalGb: number; percent: number };
  gpu: { name: string; load: number | null; memoryUsedPercent: number | null }[];
  disks: { mount: string; usedGb: number; totalGb: number; percent: number }[];
  network: { rxSec: number; txSec: number; iface: string };
  battery: { hasBattery: boolean; percent: number; isCharging: boolean; timeRemainingMin: number | null };
  temperatureC: number | null;
  topProcesses: { name: string; cpu: number; memPercent: number }[];
}

/** Registers all system-monitor-related IPC handlers. Call once from main.ts. */
export function registerSystemIpc(): void {
  ipcMain.handle('system:snapshot', async (): Promise<SystemSnapshot> => {
    const [cpuLoad, mem, gfx, fsSize, net, battery, temp, processes] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.graphics(),
      si.fsSize(),
      si.networkStats(),
      si.battery(),
      si.cpuTemperature(),
      si.processes(),
    ]);

    const cpu = await si.cpu();

    return {
      cpu: {
        load: Math.round(cpuLoad.currentLoad),
        cores: cpuLoad.cpus.map((c) => Math.round(c.load)),
        speedGhz: cpu.speed,
      },
      memory: {
        usedGb: +(mem.active / 1024 ** 3).toFixed(1),
        totalGb: +(mem.total / 1024 ** 3).toFixed(1),
        percent: Math.round((mem.active / mem.total) * 100),
      },
      gpu: gfx.controllers.map((c) => ({
        name: c.model ?? 'Unknown GPU',
        load: typeof c.utilizationGpu === 'number' ? c.utilizationGpu : null,
        memoryUsedPercent:
          c.memoryUsed && c.memoryTotal ? Math.round((c.memoryUsed / c.memoryTotal) * 100) : null,
      })),
      disks: fsSize.map((d) => ({
        mount: d.mount,
        usedGb: +(d.used / 1024 ** 3).toFixed(1),
        totalGb: +(d.size / 1024 ** 3).toFixed(1),
        percent: Math.round(d.use),
      })),
      network: net[0]
        ? { rxSec: Math.round(net[0].rx_sec / 1024), txSec: Math.round(net[0].tx_sec / 1024), iface: net[0].iface }
        : { rxSec: 0, txSec: 0, iface: 'n/a' },
      battery: {
        hasBattery: battery.hasBattery,
        percent: battery.percent,
        isCharging: battery.isCharging,
        timeRemainingMin: battery.timeRemaining > 0 ? battery.timeRemaining : null,
      },
      temperatureC: temp.main > 0 ? Math.round(temp.main) : null,
      topProcesses: processes.list
        .slice()
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 5)
        .map((p) => ({ name: p.name, cpu: +p.cpu.toFixed(1), memPercent: +p.mem.toFixed(1) })),
    };
  });

  ipcMain.handle('system:idleSeconds', () => powerMonitor.getSystemIdleTime());
}
