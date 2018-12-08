/**
 * Copyright 2018 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  balance: string;
  msg: string;

  constructor(public navCtrl: NavController) { 
    console.log('--> HomePage constructor')
  }

  getBalance() {
    var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance",WLResourceRequest.GET);
    resourceRequest.send().then((response) => {
      console.log('-->  getBalance(): Success ', response);
      
        this.msg = "Your Balance is : ";
        this.balance = response.responseText;

       
    },
    function(error){
        console.log('-->  getBalance():  ERROR ', error.responseText);
    
          this.balance = error;
      
    });
  }
}
