<?php
	class Messages {
		public function alert($type){
			echo "<div class='sweet-alert visible swing animated' data-custom-class='' data-has-cancel-button='false' data-has-confirm-button='true' data-allow-outside-click='false' data-has-done-function='false' data-animation='pop' data-timer='null' style='box-shadow: 0 0 10px #ff0000;background: rgba(255, 20, 0, 0.7);display: block; margin-top: -135px;'>
              <h2 class='grey-text'>Something went wrong!</h2>
    					<p style='display: block;' class='white-text'>" . $type . "</p>
    					<fieldset>
      						<input type='text' tabindex='3' placeholder=''>
      						<div class='sa-input-error'></div>
    					</fieldset><div class='sa-error-container'>
      						<div class='icon'>!</div>
      						<p>Not valid!</p>
    					</div>
              <div class='sa-button-container'>
      						<button class='cancel' tabindex='2' style='display: none; box-shadow: none;'>Cancel</button>
      						<div class='sa-confirm-button-container'>
        						<button class='confirm hvr-grow' onclick='$(\".sweet-alert\").remove()' tabindex='1'>OK</button>
      					  </div>
              </div>
    				</div>
    			</div>";
		}

		public function checkMessage($msg){
			if(!defined($msg)){
      	return $this->alert("Manipulated Values!");
    	} else {
      	return $this->alert(constant($msg));
    	}
		}
	}
?>