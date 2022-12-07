-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "room_num" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModReg" (
    "user_name" TEXT NOT NULL,
    "mod_name" TEXT NOT NULL,

    CONSTRAINT "ModReg_pkey" PRIMARY KEY ("user_name","mod_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- AddForeignKey
ALTER TABLE "ModReg" ADD CONSTRAINT "ModReg_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "Users"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
