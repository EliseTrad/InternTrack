-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.41 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Create database
CREATE DATABASE IF NOT EXISTS `interntracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `interntracker`;

-- Table: applications
CREATE TABLE IF NOT EXISTS `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `position_title` varchar(255) NOT NULL,
  `application_date` date NOT NULL,
  `status` enum('waitlist','rejected','not_answered','accepted') NOT NULL,
  `deadline` date DEFAULT NULL,
  `notes` text,
  `application_source` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `resume_id` int NOT NULL,
  `cover_letter_id` int DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `user_id` (`user_id`),
  KEY `resume_id` (`resume_id`),
  KEY `cover_letter_id` (`cover_letter_id`),
  CONSTRAINT `applications_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `applications_ibfk_5` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`resume_id`),
  CONSTRAINT `applications_ibfk_6` FOREIGN KEY (`cover_letter_id`) REFERENCES `cover_letters` (`cover_letter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: cover_letters
CREATE TABLE IF NOT EXISTS `cover_letters` (
  `cover_letter_id` int NOT NULL AUTO_INCREMENT,
  `cover_file_path` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cover_file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cover_upload_date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cover_letter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: interviews
CREATE TABLE IF NOT EXISTS `interviews` (
  `interview_id` int NOT NULL AUTO_INCREMENT,
  `interview_date` datetime NOT NULL,
  `interviewer_name` varchar(255) NOT NULL,
  `interviewer_email` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `reminder_sent` tinyint(1) NOT NULL,
  `interview_status` enum('scheduled','completed','cancelled','no_show') NOT NULL,
  `application_id` int NOT NULL,
  PRIMARY KEY (`interview_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add the other CREATE TABLE statements here if there are more tables (users, resumes, etc.)
