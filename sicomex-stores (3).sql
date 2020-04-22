-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2020 at 04:19 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sicomex-stores`
--

-- --------------------------------------------------------

--
-- Table structure for table `cash_detail`
--

CREATE TABLE `cash_detail` (
  `cash_detail_id` int(11) NOT NULL,
  `cash_detail` varchar(350) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cash_type` varchar(3) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_report_id` int(11) DEFAULT NULL,
  `cash_amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `check`
--

CREATE TABLE `check` (
  `check_id` int(11) NOT NULL,
  `check_number` int(12) DEFAULT NULL,
  `sup_id` int(6) DEFAULT NULL,
  `check_amount` int(11) DEFAULT NULL,
  `check_date` datetime DEFAULT NULL,
  `is_paid` int(2) DEFAULT NULL,
  `store_id` int(5) DEFAULT -1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inv_supply`
--

CREATE TABLE `inv_supply` (
  `inv_sup_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `inv_amount` int(11) DEFAULT NULL,
  `inv_date` date NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `inv_ref` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(5) NOT NULL,
  `store_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `store_manager` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_address` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_manager`, `store_address`, `amount`) VALUES
(1, 'store 1', NULL, '', 1000),
(2, 'store 2', NULL, '', 2000),
(3, 'store 3', NULL, '', 100),
(4, 'store 4', NULL, '', 400);

-- --------------------------------------------------------

--
-- Table structure for table `store_bank_acc`
--

CREATE TABLE `store_bank_acc` (
  `store_bank_acc_id` int(11) NOT NULL,
  `store_id` int(5) DEFAULT NULL,
  `check_id` int(11) NOT NULL,
  `store_report_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store_report`
--

CREATE TABLE `store_report` (
  `store_report_id` int(11) NOT NULL,
  `store_id` int(4) DEFAULT NULL,
  `sales` int(11) NOT NULL,
  `cash_supply` int(11) NOT NULL,
  `cash_expense` int(11) DEFAULT NULL,
  `bank_deposit` int(11) DEFAULT NULL,
  `remain` int(11) DEFAULT NULL,
  `report_date` datetime DEFAULT NULL,
  `start_amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store_report`
--

INSERT INTO `store_report` (`store_report_id`, `store_id`, `sales`, `cash_supply`, `cash_expense`, `bank_deposit`, `remain`, `report_date`, `start_amount`) VALUES
(1, 1, 1000, 10000, 10000, 10000, 900, '2020-04-21 00:00:00', 900);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cash_detail`
--
ALTER TABLE `cash_detail`
  ADD PRIMARY KEY (`cash_detail_id`);

--
-- Indexes for table `check`
--
ALTER TABLE `check`
  ADD PRIMARY KEY (`check_id`);

--
-- Indexes for table `inv_supply`
--
ALTER TABLE `inv_supply`
  ADD PRIMARY KEY (`inv_sup_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`);

--
-- Indexes for table `store_bank_acc`
--
ALTER TABLE `store_bank_acc`
  ADD PRIMARY KEY (`store_bank_acc_id`);

--
-- Indexes for table `store_report`
--
ALTER TABLE `store_report`
  ADD PRIMARY KEY (`store_report_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cash_detail`
--
ALTER TABLE `cash_detail`
  MODIFY `cash_detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `check`
--
ALTER TABLE `check`
  MODIFY `check_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_supply`
--
ALTER TABLE `inv_supply`
  MODIFY `inv_sup_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `store_bank_acc`
--
ALTER TABLE `store_bank_acc`
  MODIFY `store_bank_acc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_report`
--
ALTER TABLE `store_report`
  MODIFY `store_report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
