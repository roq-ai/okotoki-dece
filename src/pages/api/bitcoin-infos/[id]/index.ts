import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bitcoinInfoValidationSchema } from 'validationSchema/bitcoin-infos';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bitcoin_info
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBitcoinInfoById();
    case 'PUT':
      return updateBitcoinInfoById();
    case 'DELETE':
      return deleteBitcoinInfoById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBitcoinInfoById() {
    const data = await prisma.bitcoin_info.findFirst(convertQueryToPrismaUtil(req.query, 'bitcoin_info'));
    return res.status(200).json(data);
  }

  async function updateBitcoinInfoById() {
    await bitcoinInfoValidationSchema.validate(req.body);
    const data = await prisma.bitcoin_info.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBitcoinInfoById() {
    const data = await prisma.bitcoin_info.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
