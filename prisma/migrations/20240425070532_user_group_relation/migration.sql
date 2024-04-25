-- CreateTable
CREATE TABLE "UserGroupRelation" (
    "userId" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "perm" INTEGER NOT NULL,

    CONSTRAINT "UserGroupRelation_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "UserGroupRelation" ADD CONSTRAINT "UserGroupRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupRelation" ADD CONSTRAINT "UserGroupRelation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
