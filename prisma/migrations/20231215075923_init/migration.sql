-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "PIN" VARCHAR(255) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastSeen" VARCHAR(255),
    "usedById" INTEGER,
    "IP" VARCHAR(255),

    CONSTRAINT "machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_authorized" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_key" ON "Student"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_PIN_key" ON "Student"("PIN");

-- CreateIndex
CREATE UNIQUE INDEX "machine_name_key" ON "machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "machine_usedById_key" ON "machine"("usedById");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_authorized_AB_unique" ON "_authorized"("A", "B");

-- CreateIndex
CREATE INDEX "_authorized_B_index" ON "_authorized"("B");

-- AddForeignKey
ALTER TABLE "machine" ADD CONSTRAINT "machine_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_B_fkey" FOREIGN KEY ("B") REFERENCES "machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
