-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `cities_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(80) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `shortDescription` VARCHAR(255) NULL,
    `industry` VARCHAR(80) NOT NULL,
    `foundedYear` SMALLINT NOT NULL,
    `website` VARCHAR(255) NULL,
    `isPartner` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `cityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_slug_key`(`slug`),
    INDEX `companies_cityId_idx`(`cityId`),
    INDEX `companies_isPartner_displayOrder_idx`(`isPartner`, `displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `internships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(120) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` TEXT NOT NULL,
    `workMode` ENUM('REMOTE', 'HYBRID', 'ON_SITE') NOT NULL,
    `durationMonths` TINYINT NOT NULL,
    `schedule` VARCHAR(160) NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `stipend` DECIMAL(8, 2) NULL,
    `opensAt` DATE NOT NULL,
    `closesAt` DATE NOT NULL,
    `seats` SMALLINT NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `companyId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `internships_slug_key`(`slug`),
    INDEX `internships_companyId_idx`(`companyId`),
    INDEX `internships_cityId_idx`(`cityId`),
    INDEX `internships_featured_idx`(`featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `skills_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `internshipSkills` (
    `internshipId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,
    `position` TINYINT NOT NULL DEFAULT 0,

    INDEX `internshipSkills_skillId_idx`(`skillId`),
    PRIMARY KEY (`internshipId`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `universities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(80) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `shortName` VARCHAR(120) NOT NULL,
    `type` ENUM('PUBLIC', 'PRIVATE') NOT NULL,
    `logo` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `cityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `universities_slug_key`(`slug`),
    INDEX `universities_cityId_idx`(`cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentVerifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(40) NOT NULL,
    `studentEmail` VARCHAR(160) NOT NULL,
    `studentName` VARCHAR(120) NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `submittedAt` DATETIME(3) NOT NULL,
    `decidedAt` DATETIME(3) NULL,
    `universityId` INTEGER NOT NULL,

    UNIQUE INDEX `studentVerifications_reference_key`(`reference`),
    INDEX `studentVerifications_universityId_status_idx`(`universityId`, `status`),
    INDEX `studentVerifications_studentEmail_idx`(`studentEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(120) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `excerpt` VARCHAR(255) NOT NULL,
    `category` VARCHAR(40) NOT NULL,
    `field` VARCHAR(80) NOT NULL,
    `position` VARCHAR(160) NOT NULL,
    `authorName` VARCHAR(120) NULL,
    `authorUniversity` VARCHAR(160) NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT false,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NOT NULL,
    `companyId` INTEGER NULL,
    `universityId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `stories_slug_key`(`slug`),
    INDEX `stories_publishedAt_idx`(`publishedAt`),
    INDEX `stories_companyId_idx`(`companyId`),
    INDEX `stories_universityId_idx`(`universityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `internships` ADD CONSTRAINT `internships_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `internships` ADD CONSTRAINT `internships_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `internshipSkills` ADD CONSTRAINT `internshipSkills_internshipId_fkey` FOREIGN KEY (`internshipId`) REFERENCES `internships`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `internshipSkills` ADD CONSTRAINT `internshipSkills_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `universities` ADD CONSTRAINT `universities_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentVerifications` ADD CONSTRAINT `studentVerifications_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
