-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2021 at 11:56 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ctasia`
--

-- --------------------------------------------------------

--
-- Table structure for table `cta_department`
--

CREATE TABLE `cta_department` (
  `ID` int(11) NOT NULL,
  `DEPARTMENT_ID` int(2) NOT NULL,
  `DEPARTMENT_NAME` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cta_department`
--

INSERT INTO `cta_department` (`ID`, `DEPARTMENT_ID`, `DEPARTMENT_NAME`) VALUES
(1, 1, 'Executive'),
(2, 2, 'Marketing'),
(3, 3, 'Sales'),
(4, 4, 'Laboratory'),
(5, 5, 'Implement'),
(6, 6, 'Quality Control'),
(7, 7, 'Service'),
(8, 8, 'Infrastructure'),
(9, 9, 'Administration'),
(10, 10, 'Accounting & Financial');

-- --------------------------------------------------------

--
-- Table structure for table `cta_employee1`
--

CREATE TABLE `cta_employee1` (
  `ID` int(11) NOT NULL,
  `EMP_ID` varchar(5) NOT NULL,
  `FIRST_NAME` varchar(500) DEFAULT NULL,
  `LAST_NAME` varchar(500) DEFAULT NULL,
  `NICKNAME` varchar(25) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `LEVEL` int(11) DEFAULT 1,
  `DEPARTMENT_ID` int(2) DEFAULT NULL,
  `IS_GEN_LICENSE` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cta_employee1`
--

INSERT INTO `cta_employee1` (`ID`, `EMP_ID`, `FIRST_NAME`, `LAST_NAME`, `NICKNAME`, `EMAIL`, `LEVEL`, `DEPARTMENT_ID`, `IS_GEN_LICENSE`) VALUES
(43, '42001', 'อมร', 'ลิขิตกิจไพศาล', 'อมร', 'amornl@ctasia.com', 1, 7, 1),
(41, '42005', 'วัชชา', 'อรรถโสภากุล', 'ปรัชญา', 'watchaa@ctasia.com', 1, 4, 1),
(40, '43001', 'สุนีย์', 'มณีเกษมสุข', 'บ๊วย', 'suneem@ctasia.com', 3, 5, 1),
(38, '43006', 'สุขุมาล', 'นารายนะคามิน', 'ไก่', 'sukhumaln@ctasia.com', 1, 4, 1),
(36, '44003', 'บัณฑิต', 'วุฒิเนตรเนติรักษ์', 'ดิษ', 'bunditw@ctasia.com', 1, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cta_level`
--

CREATE TABLE `cta_level` (
  `ID` int(11) NOT NULL,
  `LEVEL_ID` int(11) NOT NULL,
  `LEVEL_DESC` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cta_level`
--

INSERT INTO `cta_level` (`ID`, `LEVEL_ID`, `LEVEL_DESC`) VALUES
(1, 1, 'Junior'),
(2, 2, 'Senior'),
(3, 3, 'PM'),
(4, 4, 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cta_department`
--
ALTER TABLE `cta_department`
  ADD PRIMARY KEY (`DEPARTMENT_ID`),
  ADD KEY `INDEX` (`ID`);

--
-- Indexes for table `cta_employee1`
--
ALTER TABLE `cta_employee1`
  ADD PRIMARY KEY (`EMP_ID`),
  ADD KEY `INDEX` (`ID`);

--
-- Indexes for table `cta_level`
--
ALTER TABLE `cta_level`
  ADD PRIMARY KEY (`LEVEL_ID`),
  ADD KEY `INDEX` (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cta_department`
--
ALTER TABLE `cta_department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cta_employee1`
--
ALTER TABLE `cta_employee1`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `cta_level`
--
ALTER TABLE `cta_level`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
