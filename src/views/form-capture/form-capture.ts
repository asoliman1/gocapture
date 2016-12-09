import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { BussinessClient } from "../../services/business-service";
import { Form, FormSubmission, SubmissionStatus, DeviceFormMembership } from "../../model";
import { FormView } from "../../components/form-view";
import { ProspectSearch } from "../prospect-search";

@Component({
  selector: 'form-capture',
  templateUrl: 'form-capture.html'
})
export class FormCapture {

  form: Form;

  submission: FormSubmission;

  @ViewChild("formView") formView: FormView;

  valid: boolean;

  prospect: DeviceFormMembership;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private client: BussinessClient, 
              private zone: NgZone,
			  private modal: ModalController) {
    
  }

  ionViewWillEnter(){
    this.form = this.navParams.get("form");
	this.submission = this.navParams.get("submission");
	if(!this.submission){
		this.submission = new FormSubmission();
		this.submission.form_id = this.form.form_id;
	}else{
		this.client.getContact(this.form, this.submission.prospect_id).subscribe(contact => {
			this.prospect = contact;
		});
	}
  }

  doRefresh(refresher){
    
  }

  doBack(){
	  this.navCtrl.pop();
  }

  doSave(){
	  if(!this.valid ){
		  return;
	  }
	  this.submission.fields = this.formView.getValues();
	  if(!this.submission.id){
		  this.submission.id = new Date().getTime();
	  }
	  if(!this.submission.status){
		  this.submission.status = SubmissionStatus.ToSubmit;
	  }
	  this.client.saveSubmission(this.submission).subscribe(sub => {
		  this.navCtrl.pop();
	  }, err => {

	  });
  }

  onValidationChange(valid : boolean){
	  this.valid = valid;
  }

  searchProspect(){
	  let search = this.modal.create(ProspectSearch, {form: this.form})
	  search.onDidDismiss((data : DeviceFormMembership) => {
		  if(data){
			  this.prospect = data;
			  this.submission.prospect_id = data.prospect_id;
			  this.submission.email = data.fields["Email"];
			  this.submission.first_name = data.fields["FirstName"];
			  this.submission.last_name = data.fields["LastName"];
		  }
	  });
	  search.present();
  }
}