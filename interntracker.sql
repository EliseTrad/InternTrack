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


-- Dumping database structure for interntracker
DROP DATABASE IF EXISTS `interntracker`;
CREATE DATABASE IF NOT EXISTS `interntracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `interntracker`;

-- Dumping structure for table interntracker.applications
DROP TABLE IF EXISTS `applications`;
CREATE TABLE IF NOT EXISTS `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `position_title` varchar(255) NOT NULL,
  `application_date` date NOT NULL,
  `status` enum('waitlist','rejected','not_answered','accepted') NOT NULL,
  `deadline` datetime DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table interntracker.applications: ~0 rows (approximately)
DELETE FROM `applications`;
INSERT INTO `applications` (`application_id`, `company_name`, `position_title`, `application_date`, `status`, `deadline`, `notes`, `application_source`, `user_id`, `resume_id`, `cover_letter_id`) VALUES
	(1, 'Murex', 'App Developer', '2024-09-28', 'waitlist', NULL, NULL, 'Linkedin', 1, 1, 2),
	(2, 'Ogero', 'Customer Services', '2024-09-28', 'accepted', NULL, NULL, 'Linkedin', 1, 1, 2),
	(3, 'Alfa', 'Software developer', '2024-09-28', 'waitlist', NULL, 'Interview was good, I love the company environment', 'Linkedin', 1, 1, 2),
	(4, 'Koura market', 'Cashier', '2025-10-19', 'accepted', NULL, NULL, 'Hire Lebanese website', 5, 2, NULL),
	(5, 'Abc Dbayeh', 'Security man', '2022-11-10', 'not_answered', '2022-11-13 00:00:00', NULL, 'Lebanese jobs website', 3, 3, 1),
	(6, 'Spinneys', 'Sale Associate', '2022-11-14', 'accepted', '2022-11-30 00:00:00', 'Boss is way too friendly, need to set some boundaries', 'Indeed', 3, 3, 1),
	(7, 'Hawa chicken', 'Manager', '2020-03-06', 'accepted', '2022-04-01 00:00:00', 'Company cares about its employees\' well-being', 'Linkedin', 2, 4, NULL),
	(8, 'Wilco', 'Team Leader', '2020-03-06', 'waitlist', '2020-04-07 00:00:00', 'I couldn\'t survive the AC', 'Referred by my cousin', 2, 4, NULL),
	(9, 'Comsmaline', 'Guest Advocate', '2020-03-07', 'accepted', NULL, NULL, 'Referred by my cousin', 2, 4, NULL),
	(10, 'Le mall Dbayeh', 'Web developer', '2023-10-15', 'rejected', '2023-10-14 00:00:00', 'I\'m late, but I will give it a try', 'Job Fair', 6, 5, 3);

-- Dumping structure for table interntracker.cover_letters
DROP TABLE IF EXISTS `cover_letters`;
CREATE TABLE IF NOT EXISTS `cover_letters` (
  `cover_letter_id` int NOT NULL AUTO_INCREMENT,
  `cover_file_path` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cover_file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cover_upload_date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cover_letter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table interntracker.cover_letters: ~0 rows (approximately)
DELETE FROM `cover_letters`;
INSERT INTO `cover_letters` (`cover_letter_id`, `cover_file_path`, `cover_file_name`, `cover_upload_date`, `user_id`) VALUES
	(1, 'https://www.google.com/imgres?q=cover%20letter%20example&imgurl=https%3A%2F%2Fcdn-blog.novoresume.com%2Farticles%2Fhow-to-write-a-cover-letter-guide%2FIT-Cover-Letter-Example.webp&imgrefurl=https%3A%2F%2Fnovoresume.com%2Fcareer-blog%2Fhow-to-write-a-cove...', 'useThis', '2025-03-09', 3),
	(2, 'https://www.google.com/imgres?q=cover%20letter%20example&imgurl=https%3A%2F%2Fvault.com%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Ffcg.infobase.com%252Fmedia%252Fxr4a3d2t%252Fcletreadv06_072823.jpg%26w%3D1080%26q%3D75&imgrefurl=https%3A%2F%2Fvault.com%2...', 'myCover', '2025-08-07', 1),
	(3, 'https://www.google.com/imgres?q=cover%20letter%20example&imgurl=https%3A%2F%2Fd25zcttzf44i59.cloudfront.net%2Facademic-cover-letter-example.png&imgrefurl=https%3A%2F%2Fwww.beamjobs.com%2Fcover-letters%2Facademic-cover-letter-examples&docid=UotyNr6RHvCB3M...', 'CoverLetterFromUni', '2024-09-10', 6);

-- Dumping structure for table interntracker.interviews
DROP TABLE IF EXISTS `interviews`;
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
  UNIQUE KEY `interviewer_email` (`interviewer_email`),
  UNIQUE KEY `interviewer_email_2` (`interviewer_email`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table interntracker.interviews: ~0 rows (approximately)
DELETE FROM `interviews`;
INSERT INTO `interviews` (`interview_id`, `interview_date`, `interviewer_name`, `interviewer_email`, `location`, `reminder_sent`, `interview_status`, `application_id`) VALUES
	(1, '2024-10-27 12:00:00', 'Myriam Khoury', 'myriamkh@outlook.com', 'Beirut', 1, 'completed', 1),
	(2, '2024-10-28 02:00:00', 'Tarek Trad', 'ttrad@gmail.com', 'Jbeil', 1, 'completed', 2),
	(3, '2024-09-29 06:00:00', 'Saydeh Khoury', 'say@outlook.com', 'Amioun', 1, 'completed', 3);

-- Dumping structure for table interntracker.resumes
DROP TABLE IF EXISTS `resumes`;
CREATE TABLE IF NOT EXISTS `resumes` (
  `resume_id` int NOT NULL AUTO_INCREMENT,
  `resume_file_path` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `resume_file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `resume_upload_date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`resume_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table interntracker.resumes: ~0 rows (approximately)
DELETE FROM `resumes`;
INSERT INTO `resumes` (`resume_id`, `resume_file_path`, `resume_file_name`, `resume_upload_date`, `user_id`) VALUES
	(1, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fs3.resume.io%2Fuploads%2Fseniority_example%2Fresume_pages%2F4589%2Fpersistent-resource%2Fstudent-herman-walton-junior-resume-example.jpg&imgrefurl=https%3A%2F%2Fresume.io%2Fresume-exam...', 'ResumeForSummer', '2024-09-28', 1),
	(2, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fresumedone-eu-west-2-staging%2FANViPOwSW-photo.png&imgrefurl=https%3A%2F%2Fresume-example.com%2Fcv%2Fstudent-resume-examples&docid=tgUFSeiP3JmGWM&tbnid=DuI...', 'ResumeLastOne', '2025-10-18', 5),
	(3, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fresumecompanion.com%2Fwp-content%2Fuploads%2F2017%2F03%2FHigh-School-Student-Resume-Sample.png&imgrefurl=https%3A%2F%2Fresumecompanion.com%2Fresume-examples%2Fhigh-school-student-resum...', 'resumeee', '2022-11-10', 3),
	(4, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fresumegenius.com%2Fwp-content%2Fuploads%2FVolunteer-Resume-Example.png%3Fw%3D1600&imgrefurl=https%3A%2F%2Fresumegenius.com%2Fresume-samples&docid=Im0LRhWKKEIV4M&tbnid=wNVPsFcKuQpgZM&ve...', 'resume2020', '2020-03-05', 2),
	(5, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fcdn.enhancv.com%2Fimages%2F648%2Fi%2FaHR0cHM6Ly9jZG4uZW5oYW5jdi5jb20vcHJlZGVmaW5lZC1leGFtcGxlcy9CamhWdnRPN25DRnBRZUlVODM0VzA3UDlaS2NvZENKNFNtSHRVQUVjL2ltYWdlLnBuZw~~.png&imgrefurl=http...', 'usjResume', '2023-10-07', 6),
	(6, 'https://www.google.com/imgres?q=resume%20example&imgurl=https%3A%2F%2Fwww.resumebuilder.com%2Fwp-content%2Fuploads%2F2020%2F10%2FStudent-Athlete-Resume-Example-Banner-Image.png&imgrefurl=https%3A%2F%2Fwww.resumebuilder.com%2Fresume-examples%2Fstudents%2F...', 'myResume', '2024-03-28', 4);

-- Dumping structure for table interntracker.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(60) NOT NULL,
  `profile_picture` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `account_created_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_name_2` (`user_name`),
  UNIQUE KEY `user_email_2` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table interntracker.users: ~2 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `user_name`, `user_email`, `user_password`, `profile_picture`, `account_created_date`) VALUES
	(1, 'elise', 'elisekaram@gmail.com', '&65Computer#@@#', 'https://www.google.com/imgres?q=pfp%20real%20person%20professional&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1494790108377-be9c29b29330%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwcHJv...', '2023-05-11 08:45:50'),
	(2, 'yasmine', 'yasminegerges09@outlook.com', '7629Helloworld?', 'https://www.google.com/imgres?q=pfp%20real%20person%20professional&imgurl=https%3A%2F%2Fwww.shutterstock.com%2Fimage-photo%2Fconfident-smiling-middle-aged-business-260nw-2451544833.jpg&imgrefurl=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fprofile-portr...', '2020-02-05 10:50:30'),
	(3, 'ilma', 'ilmaesber@gmail.com', '03314Hi?Intern##', NULL, '2022-01-10 09:08:54'),
	(4, 'trad5', 'alantr88@gmail.com', '8877jj))Internship', 'https://www.google.com/imgres?q=pfp%20real%20person%20professional&imgurl=https%3A%2F%2Fpfpmaker.com%2Fimages%2Fblog%2Flinkedin-profile-first.webp&imgrefurl=https%3A%2F%2Fpfpmaker.com%2Fblog%2F7-steps-for-creating-a-perfect-linkedin-profile&docid=dWK-dyz...', '2024-03-20 08:49:09'),
	(5, 'tonykhoury', 'tonykh@outlook.com', 'Mentos675@@i', 'https://www.google.com/imgres?q=pfp%20real%20person%20professional&imgurl=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1664540415069-bc45ce3e711e%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmVzc2lvbmFsJT...', '2024-09-12 09:59:05'),
	(6, 'john', 'johnmayer@gmail.com', 'jAckthedog##2023', NULL, '2023-10-06 10:56:07'),
	(7, 'SarahMansour', 'mansour@example.com', 'tEst123WHYlife4$', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fprofessional-profile&psig=AOvVaw0TyzvJOAsTCmfSLgoFjCKI&ust=1743619670898000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLD37Mm_t4wDFQAAAAAdAAAAABBB', '2025-04-01 22:01:23');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
