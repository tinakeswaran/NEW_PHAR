-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: pharmavital_epharmacy
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  CONSTRAINT `FKg5uhi8vpsuy0lgloxk2h4w5o6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2026-10-02 13:06:59.383939','2026-10-02 13:06:59.384904',2);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `medicine_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK99e0am9jpriwxcm6is7xfedy3` (`cart_id`),
  KEY `FK443mdab5975x96pwnnrtg99s2` (`medicine_id`),
  CONSTRAINT `FK443mdab5975x96pwnnrtg99s2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `FK99e0am9jpriwxcm6is7xfedy3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Everyday personal wellness and routine care products.','Daily Wellness'),(2,'Fictional demonstration products for the respiratory care range.','Respiratory Care'),(3,'Fictional demonstration products for digestive wellness.','Digestive Health'),(4,'Personal care products for the PharmaVital demonstration catalog.','Skin & Personal Care'),(5,'Fictional products for the women\'s wellness range.','Women\'s Wellness'),(6,'Fictional products for the men\'s wellness range.','Men\'s Wellness'),(7,'Demonstration nutrition and daily supplement products.','Immunity & Nutrition');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `delivered_at` datetime(6) DEFAULT NULL,
  `delivery_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_delivery` datetime(6) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_k36n9p5v7dd96hpgkwybvbogt` (`order_id`),
  UNIQUE KEY `UK_sxjjhx1w78xjss4g25gahe5s9` (`tracking_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (1,NULL,'CONFIRMED','2026-10-02 13:10:36.418425',1,'TRK-E817E5D8-B'),(2,'2026-10-02 15:09:34.530145','DELIVERED','2026-10-02 15:09:33.883410',2,'TRK-507B859F-0'),(3,'2026-10-02 15:11:14.728144','DELIVERED','2026-10-02 15:11:10.841589',3,'TRK-94BA757A-C'),(4,'2026-10-02 15:29:36.598120','DELIVERED','2026-10-02 15:29:36.117121',4,'TRK-173EC047-A'),(5,'2026-10-02 15:34:57.176475','DELIVERED','2026-10-02 15:34:52.493645',5,'TRK-D9273F77-A'),(6,'2026-10-02 15:38:27.558992','DELIVERED','2026-10-02 15:38:21.507458',6,'TRK-079642F9-F'),(7,'2026-10-02 16:15:11.123797','DELIVERED','2026-10-02 16:15:09.302564',7,'TRK-DF5E1566-0'),(8,'2026-10-02 16:19:11.425879','DELIVERED','2026-10-02 16:19:08.925507',8,'TRK-AD19F040-5'),(9,'2026-10-02 17:23:38.949341','DELIVERED','2026-10-02 17:23:38.130918',9,'TRK-6EFF3CAC-3'),(10,'2026-10-02 17:28:53.102073','DELIVERED','2026-10-02 17:28:52.560285',10,'TRK-158E71F0-1');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ailment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `composition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `dosage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `requires_prescription` bit(1) NOT NULL,
  `stock_quantity` int NOT NULL,
  `unit_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `units_per_pack` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKh52qpa6xy1shf4skcilxsj4oa` (`category_id`),
  CONSTRAINT `FKh52qpa6xy1shf4skcilxsj4oa` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (1,'Daily wellness','VitaCore','Demo botanical blend','2026-10-02 12:52:04.658819','Fictional demonstration wellness product. Not intended for diagnosis or treatment.','30 tablets','/products/daily-wellness.svg','VitaCore Daily',18.50,_binary '\0',80,'tablets',30,'2026-10-02 15:06:33.922939',1),(2,'Daily wellness','VitaCore','Demo nutrient blend','2026-10-02 12:52:04.666337','Fictional demonstration nutrition product. Not intended for diagnosis or treatment.','60 softgels','/products/daily-wellness.svg','Wellness D3',12.25,_binary '\0',104,'softgels',60,'2026-10-02 15:35:21.518687',1),(3,'Respiratory care','Airwell','Demo saline blend','2026-10-02 12:52:04.672357','Fictional demonstration personal care product. Follow the product label.','100 ml','/products/respiratory-care.svg','RespiraEase Mist',9.90,_binary '\0',46,'ml',100,'2026-10-02 12:52:04.672357',2),(4,'Respiratory care','Airwell','Demonstration formulation','2026-10-02 12:52:04.677870','Fictional prescription-only demo item for workflow demonstrations; not a real medicine.','20 capsules','/products/respiratory-care.svg','RespiraEase Rx',24.00,_binary '',26,'capsules',20,'2026-10-02 15:08:10.857631',2),(5,'Digestive health','CoreKind','Demo fiber blend','2026-10-02 12:52:04.683925','Fictional demonstration wellness product. Not intended for diagnosis or treatment.','30 sachets','/products/digestive-health.svg','GastroCalm Balance',16.75,_binary '\0',57,'sachets',30,'2026-10-02 12:52:04.683925',3),(6,'Digestive health','CoreKind','Demo botanical blend','2026-10-02 12:52:04.688921','Fictional demonstration wellness product. Not intended for diagnosis or treatment.','30 capsules','/products/digestive-health.svg','GastroCalm Daily',14.40,_binary '\0',63,'capsules',30,'2026-10-02 12:52:04.688921',3),(7,'Skin and personal care','DermaShield','Demo skin-care blend','2026-10-02 12:52:04.694921','Fictional demonstration personal care product. For display and workflow testing.','200 ml','/products/skin-personal-care.svg','DermaShield Lotion',21.00,_binary '\0',39,'ml',200,'2026-10-02 12:52:04.694921',4),(8,'Skin and personal care','DermaShield','Demo skin-care blend','2026-10-02 12:52:04.701923','Fictional demonstration personal care product. For display and workflow testing.','150 ml','/products/skin-personal-care.svg','DermaShield Cleanser',13.80,_binary '\0',5,'ml',150,'2026-10-02 12:52:04.701923',4),(9,'Women\'s wellness','LunaBalance','Demo botanical blend','2026-10-02 12:52:04.708224','Fictional demonstration wellness product. Not intended for diagnosis or treatment.','30 tablets','/products/womens-wellness.svg','LunaBalance Daily',19.50,_binary '\0',42,'tablets',30,'2026-10-02 12:52:04.708224',5),(10,'Women\'s wellness','LunaBalance','Demonstration formulation','2026-10-02 12:52:04.714226','Fictional prescription-only demo item for workflow demonstrations; not a real medicine.','20 capsules','/products/womens-wellness.svg','LunaBalance Comfort',26.00,_binary '',13,'capsules',20,'2026-10-02 15:31:52.505649',5),(11,'Men\'s wellness','ForgeWell','Demo nutrient blend','2026-10-02 12:52:04.721209','Fictional demonstration nutrition product. Not intended for diagnosis or treatment.','30 sachets','/products/mens-wellness.svg','ForgeWell Active',17.25,_binary '\0',25,'sachets',30,'2026-10-02 17:25:52.570345',6),(12,'Men\'s wellness','ForgeWell','Demo electrolyte blend','2026-10-02 12:52:04.727208','Fictional demonstration hydration product. Follow the product label.','12 sachets','/products/mens-wellness.svg','ForgeWell Hydration',10.50,_binary '\0',76,'sachets',12,'2026-10-02 12:52:04.727208',6),(13,'Immunity and nutrition','NutriBalance','Demo nutrient blend','2026-10-02 12:52:04.732208','Fictional demonstration nutrition product. Not intended for diagnosis or treatment.','60 capsules','/products/immunity-nutrition.svg','NutriBalance Daily',22.80,_binary '\0',91,'capsules',60,'2026-10-02 12:52:04.732208',7),(14,'Immunity and nutrition','HydraCare','Demo mineral blend','2026-10-02 12:52:04.738217','Fictional demonstration hydration product. Follow the product label.','20 sachets','https://ffklnfoinlfs.com','HydraCare Mineral',11.60,_binary '\0',482,'sachets',20,'2026-10-02 16:16:08.935505',7);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-10-02 13:06:59.395922',_binary '\0','Thank you for registering with E-Pharmacy. Explore medicines and manage your health seamlessly.','Welcome to E-Pharmacy!','WELCOME',2),(2,'2026-10-02 13:07:36.463759',_binary '\0','Your order #1 for $74.00 has been confirmed!','Order Placed Successfully','ORDER',2),(3,'2026-10-02 13:07:45.710356',_binary '','Your order #1 has been cancelled.','Order Cancelled','ORDER',2),(4,'2026-10-02 15:06:33.950116',_binary '\0','Your order #2 for $74.00 has been confirmed!','Order Placed Successfully','ORDER',2),(5,'2026-10-02 15:07:16.963422',_binary '\0','Your prescription #1 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(6,'2026-10-02 15:07:48.945314',_binary '\0','Your prescription #1 has been approved and is valid until 2026-11-01.','Prescription Approved','PRESCRIPTION',2),(7,'2026-10-02 15:08:10.868375',_binary '\0','Your order #3 for $48.00 has been confirmed!','Order Placed Successfully','ORDER',2),(8,'2026-10-02 15:09:34.540146',_binary '\0','Your order #2 has been delivered.','Order Delivered','ORDER',2),(9,'2026-10-02 15:11:14.735146',_binary '\0','Your order #3 has been delivered.','Order Delivered','ORDER',2),(10,'2026-10-02 15:25:37.897441',_binary '\0','Your prescription #2 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(11,'2026-10-02 15:25:53.237983',_binary '\0','Your prescription #2 has been approved and is valid until 2026-11-01.','Prescription Approved','PRESCRIPTION',2),(12,'2026-10-02 15:26:36.146186',_binary '\0','Your order #4 for $36.75 has been confirmed!','Order Placed Successfully','ORDER',2),(13,'2026-10-02 15:29:36.607155',_binary '\0','Your order #4 has been delivered.','Order Delivered','ORDER',2),(14,'2026-10-02 15:30:29.705718',_binary '\0','Your prescription #3 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(15,'2026-10-02 15:31:38.143131',_binary '\0','Your prescription #3 has been approved and is valid until 2026-11-01.','Prescription Approved','PRESCRIPTION',2),(16,'2026-10-02 15:31:52.512664',_binary '\0','Your order #5 for $130.00 has been confirmed!','Order Placed Successfully','ORDER',2),(17,'2026-10-02 15:34:57.187479',_binary '\0','Your order #5 has been delivered.','Order Delivered','ORDER',2),(18,'2026-10-02 15:35:21.526791',_binary '\0','Your order #6 for $61.25 has been confirmed!','Order Placed Successfully','ORDER',2),(19,'2026-10-02 15:38:27.569987',_binary '\0','Your order #6 has been delivered.','Order Delivered','ORDER',2),(20,'2026-10-02 16:11:11.175057',_binary '\0','Your prescription #4 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(21,'2026-10-02 16:11:31.168346',_binary '\0','Your prescription #4 has been approved and is valid until 2026-11-01.','Prescription Approved','PRESCRIPTION',2),(22,'2026-10-02 16:12:09.330338',_binary '\0','Your order #7 for $139.20 has been confirmed!','Order Placed Successfully','ORDER',2),(23,'2026-10-02 16:15:11.129854',_binary '\0','Your order #7 has been delivered.','Order Delivered','ORDER',2),(24,'2026-10-02 16:16:08.943501',_binary '\0','Your order #8 for $69.60 has been confirmed!','Order Placed Successfully','ORDER',2),(25,'2026-10-02 16:19:11.431444',_binary '\0','Your order #8 has been delivered.','Order Delivered','ORDER',2),(26,'2026-10-02 17:16:50.230687',_binary '\0','Your prescription #5 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(27,'2026-10-02 17:17:04.231670',_binary '\0','Your prescription #5 has been approved for the selected medicines.','Prescription Approved','PRESCRIPTION',2),(28,'2026-10-02 17:19:24.898393',_binary '\0','Your prescription #6 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(29,'2026-10-02 17:19:58.810226',_binary '\0','Your prescription #6 has been approved for the selected medicines.','Prescription Approved','PRESCRIPTION',2),(30,'2026-10-02 17:20:38.181892',_binary '\0','Your order #9 for $103.50 has been confirmed!','Order Placed Successfully','ORDER',2),(31,'2026-10-02 17:23:38.955678',_binary '\0','Your order #9 has been delivered.','Order Delivered','ORDER',2),(32,'2026-10-02 17:24:31.928026',_binary '\0','Your prescription #7 has been submitted for verification.','Prescription Uploaded','PRESCRIPTION',2),(33,'2026-10-02 17:24:52.690596',_binary '\0','Your prescription #7 has been approved for the selected medicines.','Prescription Approved','PRESCRIPTION',2),(34,'2026-10-02 17:25:52.576008',_binary '\0','Your order #10 for $69.00 has been confirmed!','Order Placed Successfully','ORDER',2),(35,'2026-10-02 17:28:53.109076',_binary '\0','Your order #10 has been delivered.','Order Delivered','ORDER',2);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `medicine_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg9h7rx5ml7y47afcha8tiftsk` (`medicine_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKg9h7rx5ml7y47afcha8tiftsk` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,18.50,4,74.00,1,1),(2,18.50,4,74.00,1,2),(3,24.00,2,48.00,4,3),(4,12.25,3,36.75,2,4),(5,26.00,5,130.00,10,5),(6,12.25,5,61.25,2,6),(7,11.60,12,139.20,14,7),(8,11.60,6,69.60,14,8),(9,17.25,6,103.50,11,9),(10,17.25,4,69.00,11,10);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `order_status` enum('PLACED','PRESCRIPTION_PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prescription_id` bigint DEFAULT NULL,
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-10-02 13:07:36.418425','CANCELLED','REFUNDED',NULL,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',74.00,'2026-10-02 13:07:45.713365',2),(2,'2026-10-02 15:06:33.883410','DELIVERED','PAID',NULL,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',74.00,'2026-10-02 15:09:34.544147',2),(3,'2026-10-02 15:08:10.841589','DELIVERED','PAID',1,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',48.00,'2026-10-02 15:11:14.738156',2),(4,'2026-10-02 15:26:36.117121','DELIVERED','PAID',2,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',36.75,'2026-10-02 15:29:36.610137',2),(5,'2026-10-02 15:31:52.493645','DELIVERED','PAID',3,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',130.00,'2026-10-02 15:34:57.190153',2),(6,'2026-10-02 15:35:21.507458','DELIVERED','PAID',2,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',61.25,'2026-10-02 15:38:27.572980',2),(7,'2026-10-02 16:12:09.302564','DELIVERED','PAID',4,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',139.20,'2026-10-02 16:15:11.131844',2),(8,'2026-10-02 16:16:08.925507','DELIVERED','PAID',4,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',69.60,'2026-10-02 16:19:11.433427',2),(9,'2026-10-02 17:20:38.130918','DELIVERED','PAID',6,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',103.50,'2026-10-02 17:23:38.957679',2),(10,'2026-10-02 17:25:52.560285','DELIVERED','PAID',7,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India',69.00,'2026-10-02 17:28:53.111299',2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(38,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `payment_date` datetime(6) NOT NULL,
  `payment_method` enum('CARD','UPI','NET_BANKING','WALLET') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_lryndveuwa4k5qthti0pkmtlx` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,74.00,1,'2026-10-02 13:07:36.428433','CARD','PAID','TXN-6514FFF3'),(2,74.00,2,'2026-10-02 15:06:33.905951','CARD','PAID','TXN-5A9E95C3'),(3,48.00,3,'2026-10-02 15:08:10.849605','CARD','PAID','TXN-6BB9D39E'),(4,36.75,4,'2026-10-02 15:26:36.123487','CARD','PAID','TXN-1A15BFE6'),(5,130.00,5,'2026-10-02 15:31:52.500033','CARD','PAID','TXN-063B637F'),(6,61.25,6,'2026-10-02 15:35:21.513454','CARD','PAID','TXN-854643DD'),(7,139.20,7,'2026-10-02 16:12:09.311566','CARD','PAID','TXN-7752F5A8'),(8,69.60,8,'2026-10-02 16:16:08.930505','CARD','PAID','TXN-C14DA558'),(9,103.50,9,'2026-10-02 17:20:38.152157','CARD','PAID','TXN-D48A789F'),(10,69.00,10,'2026-10-02 17:25:52.564825','CARD','PAID','TXN-506EBCF8');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_medicines`
--

DROP TABLE IF EXISTS `prescription_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_medicines` (
  `prescription_id` bigint NOT NULL,
  `medicine_id` bigint NOT NULL,
  PRIMARY KEY (`prescription_id`,`medicine_id`),
  KEY `FKkljsa0768eycowt9le7nb215q` (`medicine_id`),
  CONSTRAINT `FK14vcxytfp7rr81y9fdhl37bbw` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`),
  CONSTRAINT `FKkljsa0768eycowt9le7nb215q` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_medicines`
--

LOCK TABLES `prescription_medicines` WRITE;
/*!40000 ALTER TABLE `prescription_medicines` DISABLE KEYS */;
INSERT INTO `prescription_medicines` VALUES (5,7);
/*!40000 ALTER TABLE `prescription_medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) DEFAULT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','EXPIRED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `verified_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9sqwg2opdx0r4ts1vq7ei3q1c` (`user_id`),
  CONSTRAINT `FK9sqwg2opdx0r4ts1vq7ei3q1c` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (5,NULL,'/uploads/prescriptions/5237d2a6-bbcc-44d9-b5a1-63cf142627a1_Screenshot (444).png',NULL,NULL,'APPROVED','2026-10-02 17:16:50.175252','2026-10-02 17:17:04.225644','admin@epharmacy.com',2);
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `medicine_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK643e7ohd23j51m14y3hcpcaif` (`medicine_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FK643e7ohd23j51m14y3hcpcaif` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ROLE_USER','ROLE_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'2026-10-02 12:52:04.574945','admin@epharmacy.com','Administrator','$2a$10$Bq59GLHcI8UrckzY8PEWQ.bqbW7ygOvcTb.8ffHjNIb6Gz40Xyp6m',NULL,'ROLE_ADMIN','ACTIVE','2026-10-02 12:52:04.574945'),(2,'J4R9+W54, Sankari Main Rd, Sandaipet, Kondalampatti, Salem, Tamil Nadu 636005, India','2026-10-02 13:06:59.378930','Tinakes@mail.com','Tinakes','$2a$10$kfzWa93dSanSjQhms7iSFe8eZm41fvGS.ManLLSxrE8sc5wWZOrKG','+91 95974 78734','ROLE_USER','ACTIVE','2026-10-02 13:06:59.378930');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'pharmavital_epharmacy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03 17:31:05
