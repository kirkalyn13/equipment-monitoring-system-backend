-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2021 at 07:39 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `equipmentdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `indexNum` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `serial` int(30) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` int(20) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `expiration` date DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `calibrationDate` date DEFAULT NULL,
  `calibrationMethod` varchar(255) DEFAULT NULL,
  `nextCalibration` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `issuedBy` varchar(255) DEFAULT NULL,
  `issuedTo` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`indexNum`, `name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`) VALUES
(1, 'DMM CD800a', 'MULTIMETER', '2005', 2147483647, 'Digital Multimeter', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2020-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition'),
(2, 'Vernier Caliper', 'MEASURING TOOL', '2000', 96372, 'Vernier Caliper', 'INGCO', 900, 'DOST', '2050-01-01', '2000-01-01', '2019-10-21', 'External', '2020-10-22', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`indexNum`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `indexNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
