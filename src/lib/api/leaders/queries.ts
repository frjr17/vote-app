import { db } from "@/lib/db/index";
import { type LeaderId, leaderIdSchema } from "@/lib/db/schema/leaders";

export const getLeaders = async (noExistIncluded = false) => {
  let l;
  if (noExistIncluded) {
    l = await db.leader.findMany({});
  } else {
    l = await db.leader.findMany({
      where: {
        nationalId: {
          not: "noExist",
        },
      },
    });
  }
  return { leaders: l };
};

export const getLeaderById = async (id: LeaderId) => {
  const { id: leaderId } = leaderIdSchema.parse({ id });
  const l = await db.leader.findFirst({
    where: { id: leaderId },
  });
  return { leader: l };
};
export const getLeaderByNationalId = async (nationalId: string) => {
  const l = await db.leader.findFirst({
    where: { nationalId },
  });
  return { leader: l };
};

export const getLeaderByIdWithVoters = async (id: LeaderId) => {
  const { id: leaderId } = leaderIdSchema.parse({ id });
  const l = await db.leader.findFirst({
    where: { id: leaderId },
    include: { voters: { include: { leader: true } } },
  });
  if (l === null) return { leader: null };
  const { voters, ...leader } = l;

  return { leader, voters: voters };
};
