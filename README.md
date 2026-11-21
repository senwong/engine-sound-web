# Engine Sound Lab — 实时物理引擎声浪与经典跑车仪表模拟器

> **Online Demo / 在线体验**：**https://senwong.github.io/engine-sound-web/**

一款运行在浏览器中的**纯物理引擎声浪合成器与跑车仪表盘模拟器**。基于开源项目 [`DasEtwas/enginesound`](https://github.com/DasEtwas/enginesound) (MIT) 拆解改造成 **Rust → WebAssembly (`227 KB`) + Web Audio API**，无需任何录音采样文件，打开网页即可在电脑和手机上实时踩油门、换挡、撞红线断油并切换 **28 种引擎声浪** 与 **38 款经典/现代跑车仪表盘**。

A zero-sample, real-time physical internal combustion engine sound synthesizer and interactive sports car instrument cluster simulator running directly in your browser via **Rust → WebAssembly** and **Web Audio**.

---

## 核心特性 / Features

- **纯物理声波合成（Zero Audio Samples）**：通过气缸点火顺序、活塞运动、进/排气声波导管（Waveguide）与消音器共振实时合成声浪。
- **28 种引擎预设**：
  - **日系 JDM**：Civic Type R I4、S2000 高转自吸、Supra 2JZ-GTE、GT-R VR38 V6、RX-7 13B 双转子、斯巴鲁 Boxer-4、Evo IX、GR Yaris 三缸
  - **欧美街车**：美式十字曲轴 V8（Mustang / Corvette）、宝马直六（M3 E46）、奥迪直五（RS3）、街道 V10（M5 E60 / Viper）
  - **超跑**：法拉利平面曲轴 V8（458 / F8）、保时捷 911 GT3 水平对置六缸、雷克萨斯 LFA / Carrera GT V10、法拉利 812 / Aventador V12、布加迪 W16
  - **赛车**：90 年代 F1 V12（17,000 RPM）、2006 F1 V8（18,000 RPM）、NASCAR V8
  - **摩托 & 经典**：雅马哈 R1 十字曲轴、本田 CBR、杜卡迪 90° L-Twin、哈雷 45° V-Twin、KTM 大单缸、风冷甲壳虫、柴油直六重卡
- **38 款 Retina 高清跑车仪表盘**：
  - **保时捷**：911 GT3 (992.1)、911 经典绿字 (S/T)、GT3 RS 竞速黄、918 Spyder 酸绿、930 Turbo (1975)、992.2 全液晶
  - **法拉利**：458 / 812 经典黄底、488 Pista 赛道红、F40 复古黑橙、Testarossa (1984)、SF90 曲面屏
  - **兰博基尼**：Aventador 战斗机、Huracán CORSA、Countach、Miura (1966)、Revuelto
  - **经典 & 现代跑车 / JDM**：奔驰 300SL 鸥翼、捷豹 E-Type、阿斯顿·马丁 DB5、谢尔比 Cobra 427、福特 GT40 Gulf、宝马 E30 M3、奥迪 R8、AMG GT、宝马 M4、科尔维特 C8、迈凯伦 P1 / 720S、福特 GT、柯尼塞格 Jesko、雷克萨斯 LFA、帕加尼 Huayra、布加迪 Chiron、GT-R R34 Nismo、Supra MK4、NSX NA1、RX-7 FD、S2000 AP1
- **桌面 & 移动端深度适配**：
  - 桌面端快捷键：`Space` / `W` 踩油门，`Q` / `E`（或 `↓` / `↑`）加减档，`[` / `]` 盲切仪表盘
  - 移动端：底部固定大按钮驾驶栏（拇指随时踩油门/换挡）、禁止长按选中与双击放大、兼容 iOS Safari / 微信 / Chrome 音频解锁

---

## 本地构建与运行 / Local Development

```bash
# 1. 编译 Rust DSP 到 WebAssembly 并自动给前端静态资源打 SHA-256 Hash
chmod +x build.sh
./build.sh

# 2. 启动本地静态服务
cd web
python3 -m http.server 8080
```

打开 `http://localhost:8080`，点击 **启动引擎 (START)** 即可体验。

## 部署 / Deployment
- **GitHub Pages**：已内置 `.github/workflows/pages.yml`，推送 `main` 自动打资源 Hash 并发布。
- **Cloudflare Workers Static Assets**：已内置 `wrangler.jsonc`，直接 `npx wrangler deploy` 即可部署。

## License
MIT — DSP 核心改编自 [DasEtwas/enginesound](https://github.com/DasEtwas/enginesound)（详见 [LICENSE-enginesound](./LICENSE-enginesound)）。
