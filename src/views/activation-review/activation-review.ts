import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Activation } from '../../model/activation';
import { RESTClient } from '../../services/rest-client';
import { ActivationSubmissionsReview } from '../../model/activation-submissions-review';

/**
 * Generated class for the ActivationReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-activation-review',
  templateUrl: 'activation-review.html',
})
export class ActivationReviewPage {
  loading = true;
  offset = 0;
  limit = 15;
  totalCount: number;
  activation: Activation = this.navParams.get("activation")
  submissions: ActivationSubmissionsReview []= [];
  filteredSubmissions: ActivationSubmissionsReview []= [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private restClient: RESTClient) {
    this.loadSubmissions();
  }

  loadSubmissions(infiniteScroll?){
    this.restClient.getActivationSubmissions({limit: this.limit, offset: this.offset, activation_id: this.activation.id}).subscribe((data)=>{
      this.loading = false;
      this.offset += this.limit;
      this.totalCount = data.total_count
      for (let sub of data.records) {
      this.submissions.push(new ActivationSubmissionsReview(sub.prospect.first_name, sub.prospect.last_name, sub.prospect.email, sub.result.info))
      }
      this.filteredSubmissions = this.submissions;
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    }, err => {
      console.log(err)
      this.loading = false;
    })
  }

  ionViewDidLoad() {
   // console.log(this.activation);
    console.log('ionViewDidLoad ActivationReviewPage');
  }

  getItems(event) {
    let val = event.target.value;
    if(!val){
      this.filteredSubmissions = this.submissions;
    }
    else{
    this.restClient.getActivationSub({activation_id: this.activation.id, prospect: val}).subscribe((data)=>{
     // console.log("search results",data);
      if(!data){
        this.filteredSubmissions = this.submissions;
      }
      else {
      this.filteredSubmissions = ActivationSubmissionsReview.parseSubmissions(data);
      }
    })
  }

  }

  loadMore(infiniteScroll) {
   if(this.offset < this.totalCount){
    this.loadSubmissions(infiniteScroll);
   }
 
    if (this.offset >= this.totalCount) {
      infiniteScroll.enable(false);
    }
  }

}
