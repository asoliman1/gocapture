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
  offset = 0;
  limit = 9;
  totalCount: number;
  activation: Activation = this.navParams.get("activation")
  submissions: ActivationSubmissionsReview []= [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private restClient: RESTClient) {
    this.loadSubmissions();
    this.offset += this.limit;
  }

  loadSubmissions(infiniteScroll?){
    this.restClient.getActivationSubmissions({limit: this.limit, offset: this.offset, activation_id: this.activation.id}).subscribe((data)=>{
      console.log(data);
      this.totalCount = data.total_count
      for (let sub of data.records) {
      this.submissions.push(new ActivationSubmissionsReview(sub.prospect.first_name, sub.prospect.last_name, sub.prospect.email, sub.result.info))
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }

  ionViewDidLoad() {
   // console.log(this.activation);
    console.log('ionViewDidLoad ActivationReviewPage');
  }

  loadMore(infiniteScroll) {
    console.log("offset", this.offset)
    console.log("total count", this.totalCount);
   if(this.offset < this.totalCount){
    this.loadSubmissions(infiniteScroll);
    this.offset += this.limit;
   }
 
    if (this.offset >= this.totalCount) {
      infiniteScroll.enable(false);
    }
  }

}
