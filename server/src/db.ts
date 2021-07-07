import { NetworkLogs, Service } from '@prisma/client';
import { prisma } from '../index';
import { Analytics, ServiceStatus } from './types';

async function storeNetworkLogs(data: NetworkLogs): Promise<void> {
  try {
    await prisma.networkLogs.create({
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
}


async function insertSession(data: Analytics): Promise<void> {
  try {
    if (data.network.city === undefined) data.network.city = 'NA';
    if (data.network.country === undefined) data.network.country = 'NA';
    const ok = await prisma.session.create({
      data: {
        headers: data.headers,
        query: data.query,
        device: {
          create: {
            browser: data.device.browser.name!,
            os: data.device.os.name!,
            platform: data.device.platform.type!,
            engine: data.device.engine.name!,
          },
        },
        network: {
          create: {
            ip: data.network.ip,
            asn: data.network.asn,
            city: data.network.city,
            country: data.network.country,
            map: data.network.map,
          },
        },
        service: {
          connect: { host: data.serviceId },
        },
      },
    });
  } catch (err) {
    console.log(err);
    console.log('Unknown id provided, ignored!!');
  }
}

async function getDashboardData(): Promise<ServiceStatus[]> {
  const data: ServiceStatus[] = await prisma.service.findMany({
    select: {
      id: true,
      host: true,
    },
  });
  return data;
}

async function getServiceLogs(id: string, paginate: string) {
  const data = await prisma.session.findMany({
    where: {
      serviceId: id,
    },
    include: {
      device: true,
      network: true,
    },
    take: parseInt(paginate),
  });
  return data;
}

export {
  storeNetworkLogs,
  insertSession,
  getDashboardData,
  getServiceLogs,
};
