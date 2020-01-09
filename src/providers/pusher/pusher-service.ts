import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import Pusher from 'pusher-js';

@Injectable()
export class PusherServiceProvider {
  channel;

  constructor(public http: HttpClient) {
    const pusher = new Pusher('90a11cf2dc3cb70a8f61', {
      cluster: 'eu',
      encrypted: true,
    });
    this.channel = pusher.subscribe('my-channel');
  }

  public init() {
    return this.channel;
  }
}

