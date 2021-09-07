-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 07, 2021 at 09:40 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.3.29

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
-- Table structure for table `changelogs`
--

CREATE TABLE `changelogs` (
  `indexNum` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
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
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `certificate` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `changelogs`
--

INSERT INTO `changelogs` (`indexNum`, `id`, `timestamp`, `name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES
(1, 1, '2021-09-06 10:47:40', 'DMM CD800a', 'MULTIMETER', '2005', '2147483647', 'Digital Multimeter', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', NULL, NULL),
(2, 2, '2021-09-06 10:47:40', 'Vernier Caliper', 'MEASURING TOOL', '2000', '96372', 'Vernier Caliper', 'INGCO', 900, 'DOST', '2050-01-01', '2000-01-01', '2019-08-10', 'External', '2021-08-05', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', NULL, NULL),
(3, 3, '2021-09-06 10:47:40', 'DMM CD800a', 'MULTIMETER', '2003', '2147483647', 'Analog Multimeter', 'Broadway', 300, 'GDTI', '2023-10-10', '2008-08-08', '2019-08-10', 'External', '2021-06-10', 'Physics Lab', 'HAU', 'Physics Lab', 'Need Calibration', NULL, NULL),
(4, 4, '2021-09-06 10:47:40', 'testeqp', 'Type', 'Model', '93645455', 'Description', 'Brand', 123, 'Manufacturer', '2021-08-01', '2021-09-08', '2021-08-02', 'Full Calib', '2021-08-27', 'HAU', 'JP', 'JP', 'test remarks', NULL, NULL),
(12, 1, '2021-09-06 14:15:27', 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', NULL, NULL),
(13, 1, '2021-09-06 14:16:00', 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Test Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'undefined', NULL),
(14, 1, '2021-09-06 14:29:07', 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'undefined', 0x433a5c66616b65706174685c30302d4f502d43303033322d56362e302e706466),
(15, 1, '2021-09-06 14:32:13', 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Digital Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'undefined', NULL),
(16, 1, '2021-09-07 03:24:27', 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Digital Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'Online', NULL),
(17, 3, '2021-09-07 05:49:33', 'Analog Multimeter', 'MULTIMETER', 'DMM CD800a', '2147483647', 'Analog multimeters are instruments that are used to measure electrical quantities such as voltage, current, resistance, frequency and signal power.', 'Broadway', 300, 'GDTI', '2023-10-10', '2008-08-08', '2019-08-10', 'External', '2021-10-25', 'Physics Lab', 'HAU', 'Physics Lab', 'Need Calibration', 'Online', NULL),
(18, 2, '2021-09-07 05:59:47', 'Vernier Caliper', 'MEASURING TOOL', 'Vernier Caliper', '96372', 'Measures the straight linear distance between two points', 'INGCO', 900, 'DOST', '2050-01-01', '2000-01-01', '2019-08-10', 'External', '2021-10-15', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'Online', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
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
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `certificate` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `type`, `model`, `serial`, `description`, `brand`, `price`, `manufacturer`, `expiration`, `purchaseDate`, `calibrationDate`, `calibrationMethod`, `nextCalibration`, `location`, `issuedBy`, `issuedTo`, `remarks`, `status`, `certificate`) VALUES
(1, 'Digital Multimeter', 'MULTIMETER', 'DMM CD800a', '12115011728', 'Digital Electrical Measuring Tool', 'Sanwa', 2400, 'GDTI', '2030-01-01', '2005-01-01', '2019-09-23', 'External', '2021-09-23', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'Online', 0x756e646566696e6564),
(2, 'Vernier Caliper', 'MEASURING TOOL', 'Vernier Caliper', '96372', 'Measures the straight linear distance between two points', 'INGCO', 900, 'DOST', '2050-01-01', '2000-01-01', '2019-08-10', 'External', '2021-10-15', 'Physics Lab', 'HAU', 'Physics Lab', 'Good Working Condition', 'Online', 0x756e646566696e6564),
(3, 'Analog Multimeter', 'MULTIMETER', 'DMM CD800a', '2147483647', 'Analog multimeters are instruments that are used to measure electrical quantities such as voltage, current, resistance, frequency and signal power.', 'Broadway', 300, 'GDTI', '2023-10-10', '2008-08-08', '2019-08-10', 'External', '2021-10-25', 'Physics Lab', 'HAU', 'Physics Lab', 'Need Calibration', 'Online', 0x756e646566696e6564),
(4, 'testname', 'Type', 'Model', '93645455', 'Description', 'Brand', 123, 'Manufacturer', '2021-08-01', '2021-09-08', '2021-08-02', 'Full Calib', '2021-08-27', 'Physics Lab', 'JP', 'JP', 'test remarks', 'Online', 0x756e646566696e6564),
(11, 't', 't', 't', 't', 't', '', 0, '', '0000-00-00', '0000-00-00', '0000-00-00', '', '0000-00-00', '', '', '', '', 'Online', NULL),
(12, 'test', 'test', 'test', 'test', 'test', '', 0, '', '0000-00-00', '0000-00-00', '0000-00-00', '', '0000-00-00', '', '', '', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usertable`
--

CREATE TABLE `usertable` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super','admin','basic') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertable`
--

INSERT INTO `usertable` (`id`, `username`, `password`, `role`) VALUES
(13, 'testsuper', '$2b$10$df5KW9s8C0ZHUagkIebNROW1Qk97syylZwZVTgckFudnrJxZBUQZq', 'super'),
(14, 'testadmin', '$2b$10$GFIIGK8XkPZTP/sht868Q.OrqVjbRFBTCwpiqdkx9O5CGuLaRgooO', 'admin'),
(16, 'testbasic', '$2b$10$JdTgFjmECgpzWBf7zwhsBui.yU9n97N/PUTCbHSDX5gsYScG6Mc/e', 'basic');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `changelogs`
--
ALTER TABLE `changelogs`
  ADD PRIMARY KEY (`indexNum`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usertable`
--
ALTER TABLE `usertable`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `changelogs`
--
ALTER TABLE `changelogs`
  MODIFY `indexNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `usertable`
--
ALTER TABLE `usertable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
