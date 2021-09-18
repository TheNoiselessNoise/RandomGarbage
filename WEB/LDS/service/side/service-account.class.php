<?php
	if(!isset($_SESSION)){
		session_start();
	}

	class Account {
		public function manageModerators(){
			require("connect.php");
			if($_SESSION["can_manage_mod"] == "1"){
    			$sqlGetMods = "SELECT * FROM lds_admin WHERE username <> '" . $_SESSION["login_name"] . "'";
    			$rGetMods = $mconn->query($sqlGetMods);

    			$container = "<div class='row'>
                    			<div class='col s12 m12 l12'>
                      				<div class='card'>
                        				<div class='card-content center'>
                          					<div class='row'>
                          						<span id='moderators' class='card-title black-text'>Manage Moderators</span>
                          					</div>";
    
    			$table = "<form action='side/account/changepass.php' method='post'>
                			<div class='row'>
                  				<table class='responsive-table striped bordered'>
                    				<tr>
                      					<th>Username</th>
                      					<th>can_read</th>
                                <th>can_add</th>
                      					<th>can_edit</th>
                      					<th>can_delete</th>
                      					<th>can_read_forbidden</th>
                      					<th>can_add_mod</th>
                      					<th>can_manage_mod</th>
                      					<th>Has password?</th>
                      					<th class='red-text' id='del_mod'>
                                  Delete?
                                  <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='BEWARE! This deletes the moderator!'>info_outline</i>
                                </th>
                    				</tr>";

    			if($rGetMods->num_rows > 0){
      				$container .= $table;
      				$arr = ["can_read", "can_add", "can_edit", "can_delete", "can_read_forbidden", "can_add_mod", "can_manage_mod", "status"];
      				$mark = 0;

      				while($row = $rGetMods->fetch_array()){
        				$container .= "<tr id='" . $row["username"] . "'>
                    					<td style='text-align: center !important'>" . $row["username"] . "</td>";
                  
	        			foreach($arr as $ar){
    	      				if($ar != "status"){
        	    				if($row[$ar] == 0){
            	  					$container .= "<td><div class='switch'><label>No<input type='checkbox' id='{$ar}{$mark}'><span class='lever' onclick='modChangeStatus(\"" . $row["username"] . "\", \"" . $ar . "\", $(\"#{$ar}{$mark}\").prop(\"checked\"))'></span>Yes</label></div></td>";
	            				} else {
    	          					$container .= "<td><div class='switch'><label>No<input type='checkbox' id='{$ar}{$mark}' checked><span class='lever' onclick='modChangeStatus(\"" . $row["username"] . "\", \"" . $ar . "\", $(\"#{$ar}{$mark}\").prop(\"checked\"))'></span>Yes</label></div></td>";
        	    				}
          					} else {
            					if($row[$ar] == 0){
              						$container .= "<td><div class='switch'><label>No<input disabled type='checkbox'><span class='lever'></span>Yes</label></div></td>";
            					} else {
              						$container .= "<td><div class='switch'><label>No<input disabled checked type='checkbox'><span class='lever'></span>Yes</label></div></td>";
            					}
          					}
        				}

        				#delete button
        				$container .= "<td style='text-align: center !important'><i class='material-icons info-double cursor' onclick='modDelete(\"" . $row["username"] . "\")'>close</i></td>";
        
        				$container .= "</tr>";
        				$mark++;
      				}

      				$container .= "</table></div></form></div></div></div></div>";
      				return $container;
              
    			} else {
      				$container .= "<div class='row'><h4 class='center pink-text'>No moderators exists!</h4></div></div></div></div></div>";
      				return $container;
    			}
  			}
  		}

  		public function addModerators(){
  			if($_SESSION["can_add_mod"] == "1"){
  				echo "<div class='col s12 m6 l6'>
    					<div class='card'>
      						<div class='card-content center'>
        						<span class='card-title black-text'>Add moderator</span>
        						<form action='side/account/addmod.php' method='post'>

          						<div class='row'>
            						<div class='input-field col s12'>
              							<input id='modname' type='text' name='modname'>
              							<label for='modname'>Username</label>
            						</div>
            						<div class='input-field col s12 m12 l12'>
              							<input id='modmanageread' type='radio' name='modmanage' value='modmanageread' checked>
              							<label for='modmanageread'>Read <i class='material-icons info tooltipped' data-position='bottom' data-delay='50' data-tooltip='This moderator can only just read/view the data. Can&apos;t add, edit or delete databases, tables or data.'>info_outline</i></label>

              							<input id='modmanagesimple' type='radio' name='modmanage' value='modmanagesimple'>
              							<label for='modmanagesimple'>Simple <i class='material-icons info tooltipped' data-position='bottom' data-delay='50' data-tooltip='This moderator can read and edit data, but can&apos;t delete data and see forbidden databases and tables.'>info_outline</i></label>

              							<input id='modmanagesimpleplus' type='radio' name='modmanage' value='modmanagesimpleplus'>
              							<label for='modmanagesimpleplus'>Simple+ <i class='material-icons info tooltipped' data-position='bottom' data-delay='50' data-tooltip='Like Simple, but can delete data and add databases and tables.'>info_outline</i></label>

              							<input id='modmanageadvanced' type='radio' name='modmanage' value='modmanageadvanced'>
              							<label for='modmanageadvanced'>Advanced <i class='material-icons info tooltipped' data-position='bottom' data-delay='50' data-tooltip='This moderator can add, read, edit and delete data, see forbidden databases and tables, add new databases and tables, but can&apos;t add moderators.'>info_outline</i></label>

             							<input id='modmanagefullaccess' type='radio' name='modmanage' value='modmanagefullaccess'>
              							<label for='modmanagefullaccess'>Full Access <i class='material-icons info tooltipped' data-position='bottom' data-delay='50' data-tooltip='This moderator is like another administrator with full access.'>info_outline</i></label>
            						</div>
            						<div class='input-field col s12'>
              							<span class='pink-text tooltipped' data-position='bottom' data-delay='50' data-tooltip='After the moderator will try to login (without password), it will prompt him to make one.'>Password? <i class='material-icons info'>info_outline</i></span>
            						</div>
          						</div>

          						<div class='row'>
            						<div class='input-field col s12'>
              							<input type='submit' class='btn' value='Add new moderator'>
            						</div>
          						</div>

        						</form>
      						</div>
    					</div>
  					</div>
				</div>";
  			}
  		}

		public function accountPermissions(){
			require("connect.php");
			$sqlGetPerms = "SELECT * FROM lds_admin WHERE username = '" . $_SESSION["login_name"] . "'";
    		$rGetPerms = $mconn->query($sqlGetPerms);
    		$row = $rGetPerms->fetch_array();
    		$arr = ["can_read", "can_add", "can_edit", "can_delete", "can_read_forbidden", "can_add_mod", "can_manage_mod"];
    		$table = "<div class='row'>
  						<div class='col s12 m12 l12'>
    					<div class='card'>
      					<div class='card-content center'>
        				<div class='row'>
          					<span class='card-title black-text'>My permissions</span>
        				</div>

        				<div class='row'>
        				<table class='responsive-table striped bordered'>
                    	<tr>
                    		<th colspan='" . count($arr) . "'>" . $row["username"] . "</th>
                    	<tr>
                      		<th>can_read <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can view data in databases.'>info_outline</i></th>
                          <th>can_add <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can add tables and databases.'>info_outline</i></th>
                      		<th>can_edit <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can edit data in databases.'>info_outline</i></th>
                      		<th>can_delete <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can delete tables and databases.'>info_outline</i></th>
                      		<th>can_read_forbidden <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can view forbidden tables and databases.'>info_outline</i></th>
                      		<th>can_add_mod <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can add new moderators.'>info_outline</i></th>
                      		<th>can_manage_mod <i class='material-icons info tooltipped cursor' data-position='bottom' data-delay='50' data-tooltip='Can manage moderator&apos;s permissions.'>info_outline</i></th>
                    	</tr>
                    	<tr>";

            foreach ($arr as $ar) {
            	if($row[$ar] == 0){
              		$table .= "<td><div class='switch'><label>No<input disabled type='checkbox'><span class='lever'></span>Yes</label></div></td>";
            	} else {
              		$table .= "<td><div class='switch'><label>No<input disabled checked type='checkbox'><span class='lever'></span>Yes</label></div></td>";
            	}
            }

            $table .= "</tr></table></div></div></div></div></div>";

            return $table;
		}

	}
?>