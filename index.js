const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

let url = 'https://winteroo.github.io/myblog/Front/JS/001positionOperation.html';

let origin = 'https://winteroo.github.io';

class Crawler {
  constructor(url) {
    this.url = url;
  }
  start() {
    this.init(this.url);
    // 清空文件内容
    fs.writeFileSync('blogConfig.txt','');
  }
  async init(url) {
    try {
      let res = await axios.get(url);
      this.getNext(res.data);
    } catch(err){
      console.log('请求出错。');
    }
    // https.get(url, (res) => {
    //   let html = '';
    //   res.setEncoding('utf-8');
    //   res.on('data', chunk => {
    //     html += chunk;
    //   })
    //   res.on('end', () => {
    //     this.getNext(html);
    //   })
    // });
  }
  getNext(html) {
    let $ = cheerio.load(html);
    this.processHtml($);
    let nextHref = $('.next a').attr('href');
    let nextUrl = '';
    if (nextHref) {
      nextUrl = origin + nextHref;
      console.log(nextUrl);
      this.init(nextUrl);
    }
  }
  processHtml(dom) {
    let $ = dom;
    let title = this.deleteItem($('.page h1').text());
    let secondTitle = '';
    $('.page h2').each((i, el) => {
      let index = i + 1;
      let elText = this.deleteItem($(el).text());
      let secondStr = `${index}：${elText}，`
      secondTitle += secondStr;
    });
    let fileName = 'blogConfig.txt';
    let content = `一级标题：${title} \n二级标题：${secondTitle} \n`
    fs.appendFile(fileName, content, 'utf8', () => {
      console.log('爬取完毕！！');
    });
  }
  deleteItem(item) {
    let clone = item;
    return clone.replace('#', '').trim();
  }
}


let crawler = new Crawler(url);

crawler.start();