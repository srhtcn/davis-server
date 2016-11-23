import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfigService } from "../../config.service";

@Component({
    moduleId: module.id,
    selector: "config-slack",
    templateUrl: "./config-slack.component.html",
})
export class ConfigSlackComponent {

    myURL:string = "";
    submitted: boolean = false;
    buttonText: string = "Skip";
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    
    constructor(public configService: ConfigService, public router: Router) {
        this.myURL = "https://" + window.location.host;
    }
    
    //ToDo: Use https://clipboardjs.com library to add copy to clipboard functionality to URLs
    
    validate() {
        if (this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.buttonText = "Create Davis Slack Bot";
        } else if (!this.configService.config["slack"].success){
            this.buttonText = "Skip and Finish";
        }
    }
    
    doSubmit() {
        if (!this.configService.config["slack"].success && this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.configService.connectSlack()
              .then(result => {
                if (result.success) {
                  //REST call to endpoint here, trigger restart of Botkit
                  this.configService.config["slack"].success = true;
                } else {
                  this.configService.config["slack"].success = false;
                  this.configService.config["slack"].error = result.message;
                }
              },
              error => {
                  console.log(error);
                  this.configService.config["slack"].success = false;
              });
            this.submitted = true;
        } else {
            this.configService.windowLocation(this.myURL);
        }
    }
}
