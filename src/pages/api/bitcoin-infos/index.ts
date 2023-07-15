import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { bitcoinInfoValidationSchema } from 'validationSchema/bitcoin-infos';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBitcoinInfos();
    case 'POST':
      return createBitcoinInfo();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBitcoinInfos() {
    const data = await prisma.bitcoin_info
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'bitcoin_info'));
    return res.status(200).json(data);
  }

  async function createBitcoinInfo() {
    await bitcoinInfoValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.suggested_updates?.length > 0) {
      const create_suggested_updates = body.suggested_updates;
      body.suggested_updates = {
        create: create_suggested_updates,
      };
    } else {
      delete body.suggested_updates;
    }
    const data = await prisma.bitcoin_info.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
