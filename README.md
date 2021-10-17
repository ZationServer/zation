# Zation 

*Highly scalable, structured, secure, real-time application server framework 🚀.*

<h1 align="center">
  <!-- Logo -->
  <br/>
  <a href="https://zation.de">
      <img src="https://zation.de/img/zationWideLogo.svg" alt="Logo Zation" height="200"/>
  </a>
  <br/>
  <br/>
  <!-- Documentation -->
  <a href="https://zation.de/documentation/#/">
      <img src="https://img.shields.io/badge/Documentation-%20In%20progress-brightgreen.svg" alt="Vulnerabilities"/>
  </a>
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg" alt="API Stability"/>
  </a>
  <!-- TypeScript -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>    
  <!-- Downloads -->
  <a href="https://npmjs.org/package/zation">
    <img src="https://img.shields.io/npm/dm/zation.svg" alt="Downloads"/>
  </a> 
</h1>

## What is Zation?
Zation is an application server framework that lets you build fast, real-time, secure, and scalable backends. You can scale it on multiple CPU cores or machines/instances. It's ideal for creating real-time apps, e.g. mobile apps with react-native, multiplayer games, or real-time statistic apps. The Zation API provides an extensive toolbox and is well structured and documented. The entire framework has complete typescript and promises support. Also, it's easy to use, which lets you build big backends very quickly. 

A Zation server is built on different component types: Controllers, Receivers, Channels and Databoxes. Controllers give you the possibility to handle requests from clients and send responses. Receivers only receive information from a client without responding. Channels can be subscribed from the client-side to get published data from the server-side in real-time. Databoxes offers a way to synchronize data efficiently and in real-time from the server-side to a specific group of clients. All components can be protected with security rules or against invalid data. It is supported to send raw binary data or stream information in chunks between the server and the client. Underlying Zation is written in typescript and uses the WebSocket based library Ziron, which is optimized for Zation. A library for creating integration tests for a Zation server is available. At the moment, there is only a client SDK in TypeScript available.

**Notice that Zation is in development, and the final documentation is not finished yet.**

## Quick Start
```bash
# Install Zation
npm i -g zation
# Create a project
zation create <name>
```
Your new projects will come with example code, tests, and more.

## Learn More 📚

- [Read the documentation @docs.zationjs.org](https://docs.zationjs.org)

> If you really don't know how you can implement something after reading the documentation. Try to look in the documentation of the Zation API. If this not helps, feel free to contact me.

## License

While portions of the Zation source code is publicly available, Zation **is not free**.  
Except for the repositories of the ZationServer organization that contain an MIT license.   
These repositories are free to use with the conditions of the MIT license.   

To use Zation on a public server or for commercial usage, you need to purchase a license.  

- https://github.com/ZationServer/zation/wiki/Zation-End-User-License-Agreement

## Donate

Please consider donating if you think Zation is helpful to you or that my work is valuable.   
I am happy if you can help me. 
Click [here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=P3DNYQQGX3THW&source=url) to donate. 💰


