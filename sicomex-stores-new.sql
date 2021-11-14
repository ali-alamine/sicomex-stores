-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2021 at 08:35 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sicomex-stores-new`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_check`
--

CREATE TABLE `bank_check` (
  `bank_check_id` int(11) NOT NULL,
  `check_description` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `check_amount` int(11) DEFAULT NULL,
  `check_date` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `is_for_sup` tinyint(1) DEFAULT NULL,
  `invoice_ids` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `check_number` int(11) DEFAULT NULL,
  `check_order` int(5) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bank_check`
--

INSERT INTO `bank_check` (`bank_check_id`, `check_description`, `supplier_id`, `check_amount`, `check_date`, `store_id`, `is_paid`, `is_for_sup`, `invoice_ids`, `check_number`, `check_order`) VALUES
(124, NULL, 23, 11, '2020-07-22 00:00:00', 5, 1, 1, '165', 11313, 0),
(125, 'this is check details for issued by store44', NULL, 1900, '2020-07-24 00:00:00', 7, 0, 0, NULL, 121212, 0),
(126, NULL, 23, 8000, '2020-07-24 00:00:00', 7, 0, 1, '166', 73399, 1),
(127, NULL, 23, 8900, '2020-07-24 00:00:00', 7, 1, 1, '167', 7384848, 0),
(128, NULL, 30, 8000, '2020-09-11 00:00:00', 11, 1, 1, '168', 11221, 0),
(129, NULL, 30, 7000, '2020-08-31 00:00:00', 11, 1, 1, '169', 22332, 0),
(130, NULL, 30, 6000, '2020-09-11 00:00:00', 11, 1, 1, '170', 444, 0),
(131, NULL, 31, 1000, '2020-09-14 00:00:00', 12, 0, 1, '171', 838488, 0),
(132, NULL, 31, 2000, '2020-09-14 00:00:00', 12, 1, 1, '172', 332123, 0),
(134, NULL, 23, 1000, '2020-09-15 00:00:00', 12, 0, 1, '174', 131, 0),
(136, NULL, 35, 15000, '2020-09-29 00:00:00', 12, 1, 1, '177', 1222252, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cash_detail`
--

CREATE TABLE `cash_detail` (
  `cash_detail_id` int(11) NOT NULL,
  `text` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_id` int(5) DEFAULT NULL,
  `store_entry_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cash_detail`
--

INSERT INTO `cash_detail` (`cash_detail_id`, `text`, `amount`, `type`, `store_id`, `store_entry_id`) VALUES
(177, 'abc', 1000, 'sup', 5, 93),
(178, 'bca', 2000, 'sup', 5, 93),
(179, 'aa', 1000, 'exp', 5, 93),
(180, 'bb', 2000, 'exp', 5, 93),
(181, 'this is cash 1 ', 4000, 'sup', 7, 94),
(182, 'this is cash 2', 6000, 'sup', 7, 94),
(183, 'this is expense 1', 8000, 'exp', 7, 94),
(184, 'this is expense 2', 4000, 'exp', 7, 94),
(185, 'abc', 123, 'sup', 11, 99),
(186, 'bcaa', 321, 'sup', 11, 99),
(187, 'aaa', 900, 'exp', 11, 99),
(188, 'aa1', 100, 'exp', 11, 100),
(189, 'bb1', 1000, 'exp', 11, 100),
(190, 'A1', 100, 'exp', 12, 101),
(191, 'A2', 200, 'exp', 12, 101),
(192, 'B1', 1000, 'exp', 12, 102),
(193, 'B2', 2000, 'exp', 12, 102),
(194, 'first', 100, 'sup', 15, 103),
(195, 'first', 200, 'sup', 15, 103),
(196, 'first_ex', 1000, 'exp', 15, 103),
(197, 'first_ex', 3000, 'exp', 15, 103),
(198, 'second', 400, 'sup', 14, 104),
(199, 'second', 450, 'sup', 14, 104),
(200, 'second_ex', 300, 'exp', 14, 104),
(201, 'second_ex', 500, 'exp', 14, 104),
(202, 'a', 0, 'exp', 14, 105),
(203, '', 0, 'sup', 12, 108),
(204, 'a', 0, 'exp', 12, 110),
(205, 'b', 0, 'exp', 12, 110),
(206, 'aa', 300, 'exp', 12, 111);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `store_id` int(6) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `invoice_amount` bigint(11) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `check_id` int(11) DEFAULT NULL,
  `invoice_order` int(5) NOT NULL DEFAULT 0,
  `invoice_number` bigint(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `store_id`, `supplier_id`, `invoice_amount`, `invoice_date`, `is_paid`, `check_id`, `invoice_order`, `invoice_number`) VALUES
(165, 10, 23, 11, '2020-07-22', NULL, 124, 0, 3334),
(166, 7, 30, 8000, '2020-07-24', 0, 126, 0, 12345),
(167, 7, 23, 8900, '2020-07-24', 1, 127, 0, 9889),
(168, 11, 23, 8000, '2020-09-11', 1, 128, 0, 112122),
(169, 11, 23, 7000, '2020-08-31', NULL, 129, 0, 33322),
(170, 11, 29, 6000, '2020-09-12', NULL, 130, 0, 443321),
(171, 12, 31, 1000, '2020-09-14', 0, 131, 1, 1233321),
(172, 12, 31, 2000, '2020-09-14', NULL, 132, 0, 332123),
(174, 12, 23, 1000, '2020-09-14', 0, 134, 0, 433321),
(175, 15, 30, 1000, '2020-09-15', NULL, NULL, 0, 13233),
(176, 15, 23, 133, '2020-09-15', NULL, NULL, 0, 99000),
(177, 12, 35, 15000, '2020-09-20', 1, 136, 0, 44544);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_edit_history`
--

CREATE TABLE `invoice_edit_history` (
  `inv_edit_h_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_amount` bigint(11) DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(5) NOT NULL,
  `store_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `store_manager` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` bigint(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_manager`, `store_address`, `amount`) VALUES
(1, 'store 101', NULL, '', 1000),
(2, 'store 2', NULL, '', 2000),
(3, 'store 3', NULL, '', 100),
(4, 'store 4', NULL, '', -1211),
(5, 'store 33', NULL, '', 22751),
(7, 'store44', NULL, '', -2100),
(10, 'store 88', NULL, '', 0),
(11, 'test_123', NULL, '', 10200),
(12, 'Ali\'store', NULL, '', -7600),
(13, 'tttttttt', NULL, '', 0),
(14, 'aaaccc', NULL, '', 2799),
(15, 'aavvv', NULL, '', 301);

-- --------------------------------------------------------

--
-- Table structure for table `store_entry`
--

CREATE TABLE `store_entry` (
  `store_entry_id` int(11) NOT NULL,
  `store_id` int(4) DEFAULT NULL,
  `sales_amount` bigint(11) NOT NULL,
  `cash_supply_amount` int(11) DEFAULT NULL,
  `cash_expense_amount` bigint(11) DEFAULT NULL,
  `bank_deposit` int(11) DEFAULT NULL,
  `remain_amount` bigint(11) DEFAULT NULL,
  `entry_report_date` datetime DEFAULT NULL,
  `starting_amount` bigint(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store_entry`
--

INSERT INTO `store_entry` (`store_entry_id`, `store_id`, `sales_amount`, `cash_supply_amount`, `cash_expense_amount`, `bank_deposit`, `remain_amount`, `entry_report_date`, `starting_amount`) VALUES
(93, 5, 40000, 3000, 3000, 15000, 19000, '2020-06-30 00:00:00', 19000),
(94, 7, 100000, 10000, 12000, 5000, 73000, '2020-07-24 00:00:00', 73000),
(95, 7, 90000, 0, 0, 1800, 161200, '2020-07-24 00:00:00', 161200),
(96, 11, 100, 0, 0, 1000, -900, '2020-09-11 00:00:00', -900),
(97, 11, 2000, 0, 0, 5000, -3900, '2020-09-11 00:00:00', -3900),
(98, 11, 400, 0, 0, 10000, -13500, '2020-09-01 00:00:00', -13500),
(99, 11, 1000, 444, 900, 100, -13944, '2020-09-14 00:00:00', -13944),
(100, 11, 100, 0, 1100, 100, -15044, '2020-09-14 00:00:00', -15044),
(101, 12, 10000, 0, 300, 1000, 8700, '2020-09-14 00:00:00', 8700),
(102, 12, 10000, 0, 3000, 5000, 10700, '2020-09-14 00:00:00', 10700),
(103, 15, 1000, 300, 4000, 300, -3600, '2020-09-15 00:00:00', -3600),
(104, 14, 1000, 850, 800, 500, -1150, '2020-09-15 00:00:00', -1150),
(105, 14, 5, 0, 0, 1200, -2345, '2020-09-15 00:00:00', -2345),
(106, 14, 1000, 0, 0, 1000, -2345, '2020-09-19 00:00:00', -2345),
(107, 12, 100, 0, 0, 100, 10700, '2020-09-19 00:00:00', 10700),
(108, 12, 100, 0, 0, 100, 10700, '2020-09-19 00:00:00', 10700),
(109, 12, 100, 0, 0, 2000, 8800, '2020-09-19 00:00:00', 8800),
(110, 12, 30, 0, 0, 700, 8130, '2020-09-19 00:00:00', 8130),
(111, 12, 100, 0, 300, 500, 7430, '2020-09-29 00:00:00', 7430);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `supplier_amount` bigint(11) DEFAULT NULL,
  `sup_order` int(5) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `supplier_amount`, `sup_order`) VALUES
(1, 'supplier 1', -100, 0),
(2, 'Supplier 2', 2000, 0),
(5, 'supplier 6', 9877, 0),
(6, 'supplier 7', 100, 0),
(7, 'supplier 7', -1511, 0),
(23, 'supplier 10', 8215, 1),
(29, 'test', 6250, 0),
(30, 'test2', 2243, 1),
(31, 'AAA', 1000, 0),
(32, 'understand ', 0, 0),
(33, 'understand ', 0, 0),
(34, 'understand ', 0, 0),
(35, 'layla', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(4) NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_id` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `user_type`, `store_id`) VALUES
(11, 'admin', 'admin', 'emp', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_check`
--
ALTER TABLE `bank_check`
  ADD PRIMARY KEY (`bank_check_id`);

--
-- Indexes for table `cash_detail`
--
ALTER TABLE `cash_detail`
  ADD PRIMARY KEY (`cash_detail_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_id`);

--
-- Indexes for table `invoice_edit_history`
--
ALTER TABLE `invoice_edit_history`
  ADD PRIMARY KEY (`inv_edit_h_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`);

--
-- Indexes for table `store_entry`
--
ALTER TABLE `store_entry`
  ADD PRIMARY KEY (`store_entry_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_check`
--
ALTER TABLE `bank_check`
  MODIFY `bank_check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT for table `cash_detail`
--
ALTER TABLE `cash_detail`
  MODIFY `cash_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

--
-- AUTO_INCREMENT for table `invoice_edit_history`
--
ALTER TABLE `invoice_edit_history`
  MODIFY `inv_edit_h_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `store_entry`
--
ALTER TABLE `store_entry`
  MODIFY `store_entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
