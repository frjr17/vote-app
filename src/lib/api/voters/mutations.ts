import { db } from "@/lib/db/index";
import { VoterId, NewVoterParams, UpdateVoterParams, updateVoterSchema, insertVoterSchema, voterIdSchema } from "@/lib/db/schema/voters";
import { getLeaders } from "../leaders/queries";

export const createVoter = async (voter: NewVoterParams) => {
  const newVoter = insertVoterSchema.parse(voter);
  try {
    const leaders = await getLeaders(true);
    const noExistLeader = leaders.leaders.filter((leader) => leader.name === "noExist");
    if (newVoter.leaderId === "noExist") {
      newVoter.leaderId = noExistLeader[0].id;
    }
    const v = await db.voter.create({ data: newVoter });
    return { voter: v, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVoter = async (id: VoterId, voter: UpdateVoterParams) => {
  const { id: voterId } = voterIdSchema.parse({ id });
  const newVoter = updateVoterSchema.parse(voter);
  try {
    const v = await db.voter.update({ where: { id: voterId }, data: newVoter });
    return { voter: v, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVoter = async (id: VoterId) => {
  const { id: voterId } = voterIdSchema.parse({ id });
  try {
    const v = await db.voter.delete({ where: { id: voterId } });
    return { voter: v, success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
