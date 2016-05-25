-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 25, 2016 at 06:34 PM
-- Server version: 5.7.9
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `becon_graph`
--

-- --------------------------------------------------------

--
-- Table structure for table `edges`
--

CREATE TABLE `edges` (
  `source_node_id` int(10) UNSIGNED NOT NULL,
  `target_node_id` int(10) UNSIGNED NOT NULL,
  `graph_id` int(10) UNSIGNED NOT NULL,
  `locked` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `edges`
--

INSERT INTO `edges` (`source_node_id`, `target_node_id`, `graph_id`, `locked`) VALUES
(10, 12, 1, 1),
(11, 12, 1, 1),
(12, 13, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `graphs`
--

CREATE TABLE `graphs` (
  `graph_id` int(10) UNSIGNED NOT NULL,
  `graph_name` varchar(60) NOT NULL,
  `graph_desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `graphs`
--

INSERT INTO `graphs` (`graph_id`, `graph_name`, `graph_desc`) VALUES
(2, 'test_graph_2', 'Nothing.'),

-- --------------------------------------------------------

--
-- Table structure for table `nodes`
--

CREATE TABLE `nodes` (
  `node_id` int(10) UNSIGNED NOT NULL,
  `graph_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `type` set('input','operation','concept','output') NOT NULL,
  `description` text,
  `operation_left` int(11) DEFAULT NULL,
  `operation_right` int(11) DEFAULT NULL,
  `input_source_id` int(11) DEFAULT NULL,
  `output_target_id` int(11) DEFAULT NULL,
  `x_pos` float NOT NULL,
  `y_pos` float NOT NULL,
  `operation_type` set('ad','sb','ml','dv','gt','lt') DEFAULT NULL,
  `concept_aggregation` set('and','or','logit','tanh') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `nodes`
--

INSERT INTO `nodes` (`node_id`, `graph_id`, `name`, `type`, `description`, `operation_left`, `operation_right`, `input_source_id`, `output_target_id`, `x_pos`, `y_pos`, `operation_type`, `concept_aggregation`) VALUES
(10, 1, 'r', 'input', 'required rate of return', NULL, NULL, 1, NULL, -200, -100, NULL, NULL),
(11, 1, 'g', 'input', 'growth rate', NULL, NULL, 2, NULL, -200, 100, NULL, NULL),
(12, 1, 'adjusted_r', 'operation', 'adjusted growth rate (r-g)', 10, 11, NULL, NULL, 0, 0, 'sb', NULL),
(13, 1, 'adjusted_r_out', 'output', 'output node for adjusted rate of return', NULL, NULL, NULL, 1, 200, 0, NULL, NULL),
(14, 2, 'r', 'input', 'undefined', NULL, NULL, 1, NULL, -12, 94, NULL, NULL),
(15, 2, 'i', 'input', 'undefined', NULL, NULL, 2, NULL, 241, 96, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sources`
--

CREATE TABLE `sources` (
  `source_id` int(10) UNSIGNED NOT NULL,
  `earliest_date` int(11) DEFAULT NULL,
  `latest_date` int(11) DEFAULT NULL,
  `periodicity` int(11) DEFAULT NULL,
  `mySql_data_ticker` int(11) DEFAULT NULL,
  `file_location` int(11) DEFAULT NULL,
  `source_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `edges`
--
ALTER TABLE `edges`
  ADD UNIQUE KEY `source_node_id` (`source_node_id`,`target_node_id`,`graph_id`);

--
-- Indexes for table `graphs`
--
ALTER TABLE `graphs`
  ADD PRIMARY KEY (`graph_id`),
  ADD UNIQUE KEY `graph_name` (`graph_name`),
  ADD KEY `graph_id` (`graph_id`);

--
-- Indexes for table `nodes`
--
ALTER TABLE `nodes`
  ADD PRIMARY KEY (`node_id`,`graph_id`) USING BTREE;

--
-- Indexes for table `sources`
--
ALTER TABLE `sources`
  ADD PRIMARY KEY (`source_id`),
  ADD UNIQUE KEY `source_name` (`source_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graphs`
--
ALTER TABLE `graphs`
  MODIFY `graph_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `nodes`
--
ALTER TABLE `nodes`
  MODIFY `node_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;
--
-- AUTO_INCREMENT for table `sources`
--
ALTER TABLE `sources`
  MODIFY `source_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE  `edges` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE  `graphs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE  `nodes` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE  `sources` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

