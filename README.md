# Engine Sound Lab (Rust → Wasm + Web Audio)

基于开源项目 [`DasEtwas/enginesound`](https://github.com/DasEtwas/enginesound) (MIT) 拆解改造成的**网页端实时物理引擎声浪合成器**。

## 特性
- **纯物理声波合成**：无任何音频采样文件，所有声浪由 Rust 编译的 WebAssembly 在浏览器 `AudioWorklet` 独立音频线程中实时计算。
- **11 种引擎预设**：包含 `enginesound` 全部 7 个经典 `.esc` 预设，以及美式十字曲轴 V8、高转 F1 V10、自然吸气 V12、水平对置 Boxer-4。
- **交互驾驶舱**：实时转速表 + 波形示波器、按住踩油门（支持鼠标/触屏/`Space`/`W`）、6 速加减档（`Q`/`E`）与红线断油弹跳、手动锁定转速模式。
- **实时声学调校**：动态调节进气/排气/缸体震动比例、进排气门正时偏移与主音量。

## 构建与运行

```bash
# 1. 编译 Rust DSP 到 Wasm（首次需要 wasm32-unknown-unknown target）
chmod +x build.sh
./build.sh

# 2. 启动本地静态服务
cd web
python3 -m http.server 8080
```

然后浏览器打开 `http://localhost:8080`，点击右上角 **启动引擎 (START)** 即可。
