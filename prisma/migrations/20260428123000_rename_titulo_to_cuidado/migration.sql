-- Migration: rename titulo->cuidado and descricao->regamento
-- Execute this SQL against your MySQL database

ALTER TABLE `plantas` 
  CHANGE COLUMN `titulo` `cuidado` VARCHAR(191) NOT NULL,
  CHANGE COLUMN `descricao` `regamento` VARCHAR(191) NOT NULL;
