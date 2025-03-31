-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: interntracker
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(45) NOT NULL,
  `position_title` varchar(45) DEFAULT NULL,
  `application_date` datetime NOT NULL,
  `status` enum('waitlist','rejected','not answered','accepted') NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `application_source` varchar(45) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `resume_id` int(11) unsigned NOT NULL,
  `cover_letter_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `application-user_idx` (`user_id`),
  KEY `application-cover_idx` (`cover_letter_id`),
  KEY `application-resume_idx` (`resume_id`),
  CONSTRAINT `application-cover` FOREIGN KEY (`cover_letter_id`) REFERENCES `cover_letters` (`cover_letter_id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `application-resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`resume_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `application-user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,'Murex','App Developer','2024-09-28 05:50:10','waitlist',NULL,NULL,'Linkedin',1,1,2),(2,'Ogero','Customer Services','2024-09-28 06:20:02','accepted',NULL,NULL,'Linkedin',1,1,2),(3,'Alfa','Software developer','2024-09-28 07:10:00','waitlist',NULL,'Interview was good, i love the company environment','Linkedin',1,1,2),(4,'Koura market','Cashier','2025-10-19 08:10:00','accepted',NULL,'','Hire Lebanese website',5,2,NULL),(5,'Abc Dbayeh','Security man','2022-11-10 09:10:00','not answered','2022-11-13 00:00:00','','Lebanese jobs website',3,3,1),(6,'Spinneys','Sale Associate','2022-11-14 10:10:00','accepted','2022-11-30 00:00:00','boss is way too friendly need to set some boundaries','Indeed',3,3,1),(7,'Hawa chicken','Manager','2020-03-06 10:30:00','accepted','2022-04-01 00:00:00','company cares about its employees\' well being','Linkedin',2,4,NULL),(8,'Wilco','Team Leader','2020-03-06 10:50:00','waitlist','2020-04-07 00:00:00','I couldn\'t survive the ac ','Referred by my cousin',2,4,NULL),(9,'Comsmaline','Guest Advocate','2020-03-07 00:00:00','accepted',NULL,NULL,'Referred by my cousin',2,4,NULL),(10,'Le mall Dbayeh','Web developer','2023-10-15 00:00:00','rejected','2023-10-14 00:00:00','I\'m late but i will give it a try','Job Fair',6,5,3);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cover_letters`
--

DROP TABLE IF EXISTS `cover_letters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cover_letters` (
  `cover_letter_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cover_file_path` varchar(200) NOT NULL,
  `cover_file_name` varchar(45) NOT NULL,
  `cover_upload_date` datetime NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`cover_letter_id`),
  KEY `covers-users_idx` (`user_id`),
  CONSTRAINT `covers-users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cover_letters`
--

LOCK TABLES `cover_letters` WRITE;
/*!40000 ALTER TABLE `cover_letters` DISABLE KEYS */;
INSERT INTO `cover_letters` VALUES (1,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\cover_letters\\cover1.pdf','cover1.pdf','2025-03-09 00:00:00',3),(2,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\cover_letters\\cover2.pdf','cover2.pdf','2025-08-07 00:00:00',1),(3,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\cover_letters\\cover3.pdf','cover3.pdf','2024-09-10 00:00:00',6);
/*!40000 ALTER TABLE `cover_letters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `interviews_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `interview_date` timestamp NOT NULL,
  `interviewer_name` varchar(45) DEFAULT NULL,
  `interviewer_email` varchar(45) DEFAULT NULL,
  `location` varchar(45) NOT NULL,
  `reminder_sent` tinyint(4) NOT NULL,
  `interview_status` enum('scheduled','completed','cancelled','no_show') NOT NULL,
  `application_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`interviews_id`),
  KEY `int-app_idx` (`application_id`),
  CONSTRAINT `int-app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES (1,'2024-10-27 10:00:00','Myriam Khoury','myriamkh@outlook.com','Beirut',1,'completed',1),(2,'2024-10-28 00:00:00','Tarek Trad','ttrad@gmail.com','Jbeil',1,'completed',2),(3,'2024-09-29 03:00:00','Saydeh Khoury ','say@outlook.com','Amioun',1,'completed',3);
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumes`
--

DROP TABLE IF EXISTS `resumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumes` (
  `resume_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `resume_file_path` varchar(200) NOT NULL,
  `resume_file_name` varchar(45) NOT NULL,
  `resume_upload_date` varchar(45) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`resume_id`),
  KEY `resume-user_idx` (`user_id`),
  CONSTRAINT `resume-user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumes`
--

LOCK TABLES `resumes` WRITE;
/*!40000 ALTER TABLE `resumes` DISABLE KEYS */;
INSERT INTO `resumes` VALUES (1,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume1.pdf','resume1.pdf','2024-09-28',1),(2,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume2.pdf','resume2.pdf','2025-10-18',5),(3,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume3.pdf','resume3.pdf','2022-11-10',3),(4,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume1.pdf','resume4.pdf','2020-03-05 ',2),(5,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume5.pdf','resume5.pdf','2023-10-07',6),(6,'C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\resumes\\resume6.pdf','resume6.pdf','2024-03-28',4);
/*!40000 ALTER TABLE `resumes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `user_email` varchar(45) NOT NULL,
  `user_password` varchar(45) NOT NULL,
  `profile_picture` varchar(200) DEFAULT NULL,
  `account_created_date` timestamp NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'elise','elisekaram@gmail.com','&65computer##','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\elise.jpeg','2023-05-11 05:45:50'),(2,'yasmine','yasminegerges09@outlook.com','7629helloworld?','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\yasmine.jpeg','2020-02-05 08:50:30'),(3,'ilma','ilmaesber@gmail.com','03314Hi?intern##','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\ilma.jpg','2022-01-10 07:08:54'),(4,'trad5','alantr88@gmail.com','8877jj))internship','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\trad5.jpeg','2024-03-20 06:49:09'),(5,'tonykhoury','tonykh@outlook.com','mentos675@@i','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\tonykhoury.jpg','2024-09-12 06:59:05'),(6,'john','johnmayer@gmail.com','jackthedog##2023','C:\\Users\\hp\\Desktop\\current sem\\WEB\\interntracker\\users\\profile\\john.jpeg','2023-10-06 07:56:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-19 14:19:34
