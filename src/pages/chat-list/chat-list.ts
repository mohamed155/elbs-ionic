import {Component} from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';
import {SharedDataProvider} from "../../providers/shared-data/shared-data";
import {ConfigProvider} from "../../providers/config/config";
import {ChatPage} from "../chat/chat";

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider
  ) {

  }


  openChat(id) {
    this.navCtrl.push(ChatPage, {customer_id: id});
  }

}
