import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { ProductManagerComponent } from './manage/product-manager.component';
import { ApiService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    RecommendationsComponent,
    ProductManagerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
