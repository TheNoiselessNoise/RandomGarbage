SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `lds` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `lds`;

DROP TABLE IF EXISTS `lds_admin`;
CREATE TABLE IF NOT EXISTS `lds_admin` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `username` varchar(99) NOT NULL,
  `password` varchar(99) NOT NULL,
  `isAdmin` int(1) NOT NULL,
  `status` int(1) NOT NULL,
  `can_read` int(1) NOT NULL,
  `can_add` int(1) NOT NULL,
  `can_edit` int(1) NOT NULL,
  `can_delete` int(1) NOT NULL,
  `can_read_forbidden` int(1) NOT NULL,
  `can_add_mod` int(1) NOT NULL,
  `can_manage_mod` int(1) NOT NULL,
  `CAPTCHA` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lds_history`;
CREATE TABLE IF NOT EXISTS `lds_history` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `db_name` varchar(32) NOT NULL,
  `query` text NOT NULL,
  `user_id` int(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lds_settings`;
CREATE TABLE IF NOT EXISTS `lds_settings` (
  `user_id` int(11) NOT NULL,
  `db` varchar(32) NOT NULL,
  `s_is_mobile` varchar(5) NOT NULL,
  `s_show_col_types` varchar(5) NOT NULL,
  `s_hover_styles` varchar(5) NOT NULL,
  `s_overflow_styles` varchar(5) NOT NULL,
  `s_data_limit_from` int(9) NOT NULL,
  `s_data_limit_to` int(9) NOT NULL,
  `s_ui_color` varchar(7) NOT NULL,
  `s_ui_back_color` varchar(7) NOT NULL,
  `s_ui_text_color` varchar(7) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
