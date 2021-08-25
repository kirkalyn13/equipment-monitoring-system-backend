-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2021 at 03:26 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

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
  `serial` varchar(30) DEFAULT NULL,
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
(1, 'DMM CD800a', 'MULTIMETER', '2005', '2147483647', 'Digital Multimeter', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition'),
(2, 'Vernier Caliper', 'MEASURING TOOL', '2000', '96372', 'Vernier Caliper', 'INGCO', 900, 'DOST', '2050-01-01', '2000-01-01', '2019-08-10', 'External', '2021-08-05', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition'),
(7, 'DMM CD800a', 'MULTIMETER', '2003', '2147483647', 'Analog Multimeter', 'Broadway', 300, 'GDTI', '2023-10-10', '2008-08-08', '2019-08-10', 'External', '2021-06-10', 'Physics Lab', 'HAU', 'Physics Lab', 'Need Calibration'),
(8, 'Name', 'Type', 'Model', '93645455', 'Description', 'Brand', 123, 'Manufacturer', '2021-08-01', '2021-09-08', '2021-08-02', 'Full Calib', '2021-09-11', 'HAU', 'JP', 'JP', 'test remarks');

-- --------------------------------------------------------

--
-- Table structure for table `usertable`
--

CREATE TABLE `usertable` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('super','admin','basic') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertable`
--

INSERT INTO `usertable` (`id`, `username`, `password`, `role`) VALUES
(1, 'engrZerep', 'laxusdreyar', 'super'),
(2, 'custodian', 'lab123', 'admin'),
(3, 'student1', 'physics123', 'basic');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`indexNum`);

--
-- Indexes for table `usertable`
--
ALTER TABLE `usertable`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `indexNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `usertable`
--
ALTER TABLE `usertable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
