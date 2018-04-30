import { FormUtils } from '../../util/form';
import { FormElement, FormSubmission } from '../../model';
import { FormElementType } from '../../model';
import { Component, ElementRef, ViewChild, NgZone, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Form } from "../../model";
import { ImageProcessor, Info, RecognitionResult } from "../../services/image-processor";
import { File } from '@ionic-native/file';
import { Content } from 'ionic-angular/components/content/content';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import {Util} from "../../util/util";

@Component({
  selector: 'ocr-selector',
  templateUrl: 'ocr-selector.html',
  animations: [
    trigger('isVisibleChanged', [
      state('true', style({ opacity: 1, "z-index": 1})),
      state('false', style({ opacity: 0, "z-index": -1 })),
      transition('* => *', animate('350ms'))
    ])
  ]
})
export class OcrSelector {

  @ViewChild(Content)
  content: Content;

  public form: Form;

  public submission: FormSubmission;

  public valuesToPropagate: any;

  image: string;

  private multiselect = false;

  private info: Info;

  private selectedWords = {};

  @ViewChild('card') elementView: ElementRef;

  wordElements: Word[] = [];
  loading: boolean = true;
  isLoading = this.loading + "";
  changedValues:any = {};
  private oldWidth = 0;

  private result: RecognitionResult;

  private restrictedTypes: string[] = [
    "page_break",
    "section",
    "image",
    "business_card",
    "signature"
  ];

  private selectValueForElement: string;

  public title: string = "Recognized text";

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private zone: NgZone,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private imageProc: ImageProcessor,
              private util: Util) {
    this.info = params.get("imageInfo");
    this.submission = JSON.parse(JSON.stringify(params.get('submission') || {}));
    this.form = params.get("form");
    this.image = this.info.dataUrl;
  }

  onSelect(identifier: string){
    this.content.scrollToTop(100);
    this.selectValueForElement = identifier;
    this.title = "Choose for " + FormUtils.getLabelByIdentifier(identifier, this.form);
  }

  propagateDirectChanges(data) {
    for (let identifier in data) {
      if(typeof data[identifier] == "object"){
        for(let id in data[identifier]){
          this.wordElements.forEach(word => {
            if(word.assigned && word.assigned.field == id && word.word != data[identifier][id]){
              word.word = data[identifier][id];
            }
          });
        }
      } else {
        this.wordElements.forEach(word => {
          if(word.assigned && word.assigned.field == identifier && word.word != data[identifier]){
            word.word = data[identifier];
          }
        });
      }
    }
  }

  ionViewDidEnter() {
    let z = this.zone;
    let t = this;
    this.oldWidth = this.elementView.nativeElement.width;
    setTimeout(() => {
      t.imageProc.recognize(t.info.dataUrl).subscribe((data) => {
        z.run(()=>{
          t.result = data;
          t.positionWords(data);
          t.loading = false;
          t.isLoading = t.loading + "";
        });
      });
    }, 1);
  }

  flip() {
    let z = this.zone;
    let t = this;
    let image = this.info.dataUrl;
    this.loading = true;
    this.isLoading = this.loading + "";
    this.imageProc.flip(this.normalizeURL(this.info.dataUrl)).subscribe( info => {
      let name = image.substr(image.lastIndexOf("/") + 1).replace(/\?.*/, "");
      let folder = image.substr(0, image.lastIndexOf("/"));
      new File().writeFile(folder, name, this.imageProc.dataURItoBlob(info.dataUrl), {replace: true}).then((entry)=>{
        z.run(() => {
          t.image = t.info.dataUrl.replace(/\?.*/, "") + "#" + parseInt(((1 + Math.random())*1000) + "");
          t.info.dataUrl = t.image;
          t.ionViewDidEnter();
        });
      });
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event){
    if(this.elementView.nativeElement.width != this.oldWidth && this.result){
      this.oldWidth = this.elementView.nativeElement.width;
      console.log("repositioning");
      this.positionWords(this.result);
    }
  }

  positionWords(data: {
    recognizedText: string;
    words: {
      word: string;
      box: string;
      confidence: number;
    }[]
  }) {
    var ratio = this.elementView.nativeElement.width / this.info.width;
    let list: Word[] = [];
    let w: Word;
    let uom = "px";
    data.words.forEach(element => {
      w = new Word();
      w.word = element.word;
      w.confidence = element.confidence;
      var coords = element.box.split(" ");
      w.nLeft = (parseFloat(coords[0]) * ratio - 2);
      w.nTop = (parseFloat(coords[1]) * ratio - 2);
      w.nWidth = (parseFloat(coords[2]) * ratio + 4);
      w.nHeight = (parseFloat(coords[3]) * ratio + 4);
      w.left = w.nLeft + uom;
      w.top = w.nTop + uom;
      w.width = w.nWidth + uom;
      w.height = w.nHeight + uom;
      list.push(w);
      this.attemptAutoAssignment(w);
    });
    let v = {};
    let hasAssignments = false;
    list.forEach(w => {
      if(w.assigned){
        v[w.assigned.field] = w.word;
        hasAssignments = true;
      }
    });
    if(hasAssignments){
      this.valuesToPropagate = v;
    }
    this.wordElements = list;
  }

  wordClicked(word: Word, cb?: Function) {
    if(this.selectValueForElement != null){
      word.assigned = new Assigned(this.selectValueForElement, FormUtils.getLabelByIdentifier(this.selectValueForElement, this.form));
      this.selectValueForElement = null;
      let v = {};
      v[word.assigned.field] = word.word;
      this.valuesToPropagate = v;
      this.title = "Recognized text";
      return;
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: word.word,
      cssClass: "word-actions",
      subTitle: word.assigned ? "Assigned to field " + word.assigned.label : "Not assigned to a field",
      buttons: [
        {
          text: 'Edit',
          icon: "create",
          handler: () => {
            let alert = this.alertCtrl.create({
              title: '<i class="pull-left icon icon-md ion-md-create"></i>  ' + word.word,
              cssClass: "edit-word",
              inputs: [
                {
                  name: 'word',
                  placeholder: 'word',
                  value: word.word
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                    this.wordElements.forEach((element)=>{
                      element.selected = false;
                    });
                  }
                },
                {
                  text: 'Update',
                  handler: data => {
                    word.word = data.word;
                    actionSheet.setTitle(word.word);
                    let t = {};
                    t[word.assigned.field] = word.word;
                    this.valuesToPropagate = t;
                    cb && cb(word);
                  }
                }
              ]
            });
            alert.present();
            return false;
          }
        }, {
          text: word.assigned ? 'Assign to another field' : 'Assign to field',
          icon: "eye",
          handler: () => {
            let inputs = [];
            let nameMap = {
              "FirstName": "First Name",
              "LastName": "Last Name"
            };
            this.form.elements.forEach(element => {
              if(this.restrictedTypes.indexOf(element.type) > -1){
                return;
              }
              if(element.mapping && element.mapping.length > 1){
                element.mapping.forEach(mapping => {
                  inputs.push({
                    type: 'radio',
                    label: nameMap[mapping.ll_field_unique_identifier] || mapping.ll_field_unique_identifier,
                    value: mapping["identifier"]
                  });
                })
              }else{
                inputs.push({
                  type: 'radio',
                  label: element.title,
                  value: element["identifier"]
                });
              }
            });
            console.log(inputs);
            inputs[0].checked = true;
            let alert = this.alertCtrl.create({
              title: '<i class="pull-left icon icon-md ion-md-eye"></i>  ' + word.word,
              //subTitle: "Assign to field",
              cssClass: "assign-field",
              inputs: inputs,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                    this.wordElements.forEach((element)=>{
                      element.selected = false;
                    });
                  }
                },
                {
                  text: 'Update',
                  handler: data => {
                    cb && cb(word);
                    if (data) {
                      var title = "";
                      for (let i = 0; i < this.form.elements.length; i++) {
                        if (this.form.elements[i]["identifier"] == data) {
                          title = this.form.elements[i].title;
                          break;
                        }
                      }
                      word.assigned = new Assigned(data, title);
                      let v = {};
                      v[word.assigned.field] = word.word;
                      this.valuesToPropagate = v;
                    }
                  }
                }
              ]
            });
            alert.present();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.wordElements.forEach((element)=>{
              element.selected = false;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  done() {
    let changedValues = {};
    this.wordElements.forEach(word => {
      if(!!word.assigned){
        changedValues[word.assigned.field] = word.word;
      }
    });
    this.viewCtrl.dismiss(changedValues);
  }

  onPressStart(event){
    this.zone.run(()=>{
      this.multiselect = true;
      let w = {};
      this.wordElements.forEach((element, index)=>{
        w[index] = false;
        element.selected = false;
      });
      this.selectedWords = w;
    });
  }

  onPressEnd(event){
    if(!this.multiselect){
      return;
    }
    this.multiselect = false;
    let words: Word[] = [];
    for(let index in this.selectedWords){
      this.selectedWords[index] && words.push(this.wordElements[index]);
    }
    let word = this.buildWordGroup(words);
    this.wordClicked(word, (word) => {
      let words:Word[] = [];
      let done = false;
      this.wordElements.forEach((w, index)=>{
        if(!this.selectedWords[index]){
          words.push(w);
        }else if(!done){
          words.push(word);
          done = true;
        }
      });
      this.wordElements = words;
    });
  }

  private buildWordGroup(words: Word[]): Word{
    let w = new Word();
    w.word = "";
    let uom = "px";
    let minx = Infinity, maxx = 0, miny = Infinity, maxy = 0;
    words.forEach((word) => {
      if(w.word){
        w.word += " ";
      }
      w.word += word.word;
      minx = minx > word.nLeft ? word.nLeft: minx;
      miny = miny > word.nTop ? word.nTop: miny;
      maxx = maxx < word.nLeft + word.nWidth ? word.nLeft + word.nWidth: maxx;
      maxy = maxy < word.nTop + word.nHeight ? word.nTop + word.nHeight: maxy;
    });
    w.nTop = miny;
    w.nLeft = minx;
    w.nWidth = maxx - minx;
    w.nHeight = maxy - miny;
    w.left = w.nLeft + uom;
    w.top = w.nTop + uom;
    w.width = w.nWidth + uom;
    w.height = w.nHeight + uom;
    return w;
  }

  onTouchMove(event:TouchEvent){
    if(this.multiselect && event.touches.length > 0){
      let t = event.touches.item(0);
      let elem = document.elementFromPoint(t.pageX, t.pageY);
      let index = parseInt(elem.id);
      if(index > 0 && !this.selectedWords[index]){
        this.zone.run(()=>{
          this.selectedWords[index] = true;
          if(this.wordElements[index]){
            this.wordElements[index].selected = true;
          }
        });
      }
    }
  }

  private attemptAutoAssignment(word: Word){
    //test for email
    if(word.word.indexOf("@") > 0 && word.word.endsWith(".com") || word.word.endsWith(".net") || word.word.endsWith(".org")){
      //we have an email, let's find an email field and if found set the word as assigned
      let id = this.form.getIdByFieldType(FormElementType.email);
      if(id){
        for (let i = 0; i < this.form.elements.length; i++) {
          if (this.form.elements[i]["identifier"] == id) {
            word.assigned = new Assigned(this.form.elements[i]["identifier"], this.form.elements[i].title);
            break;
          }
        }
      }
    }
  }

  private normalizeURL(url: string): string {
    return this.util.normalizeURL(url);
  }
}

class Word {
  word: string;
  width: string|number;
  height: string|number;
  top: string|number;
  left: string|number;
  nWidth: number;
  nHeight: number;
  nTop: number;
  nLeft: number;
  confidence: number;
  assigned: Assigned;
  selected: boolean = false;
}

class Assigned {
  field: string;
  label: string;

  constructor(field: string, label: string) {
    this.label = label;
    this.field = field;
  }
}
