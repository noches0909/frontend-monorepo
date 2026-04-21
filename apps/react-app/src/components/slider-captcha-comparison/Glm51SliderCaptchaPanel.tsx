import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Space, Typography } from "@acme/ui";

/* ───────── constants ───────── */
const CANVAS_W = 340;
const CANVAS_H = 190;
const PIECE_SIZE = 44;
const PIECE_R = 9; // 拼图凸起半径
const TOLERANCE = 5; // 允许误差(px)

/* ───────── helpers ───────── */

/** 绘制拼图块路径 (带凸起) */
function puzzlePath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  r: number
) {
  ctx.beginPath();
  const s = size;
  // 上边 + 凸起
  ctx.moveTo(x, y);
  ctx.lineTo(x + s * 0.36, y);
  ctx.arc(x + s * 0.5, y - r, r, Math.PI * 0.8, Math.PI * 0.2, false);
  ctx.lineTo(x + s, y);
  // 右边 + 凸起
  ctx.lineTo(x + s, y + s * 0.36);
  ctx.arc(x + s + r, y + s * 0.5, r, Math.PI * 1.3, Math.PI * 0.7, false);
  ctx.lineTo(x + s, y + s);
  // 下边
  ctx.lineTo(x, y + s);
  // 左边
  ctx.closePath();
}

/** 随机整数 [min, max] */
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 用 Canvas 绘制拼图轮廓遮罩图 */
function renderPuzzleMask(
  width: number,
  height: number,
  px: number,
  py: number
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, width, height);
  // 挖洞
  ctx.globalCompositeOperation = "destination-out";
  puzzlePath(ctx, px, py, PIECE_SIZE, PIECE_R);
  ctx.fill();
  return c;
}

/** 用 Canvas 裁出拼图块图片 */
function renderPuzzlePiece(
  img: HTMLImageElement,
  px: number,
  py: number,
  offsetX: number
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = CANVAS_W;
  c.height = CANVAS_H;
  const ctx = c.getContext("2d")!;
  // clip 拼图形状在显示位置 (offsetX, py)
  puzzlePath(ctx, offsetX, py, PIECE_SIZE, PIECE_R);
  ctx.clip();
  // 偏移绘制图片，使缺口处 (px) 的内容出现在 (offsetX) 位置
  ctx.drawImage(img, offsetX - px, 0, CANVAS_W, CANVAS_H);
  // 描边
  puzzlePath(ctx, offsetX, py, PIECE_SIZE, PIECE_R);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  return c;
}

/** 生成一张随机风景占位图 (纯 Canvas 绘制，无需外部资源) */
function generatePlaceholderImage(): string {
  const c = document.createElement("canvas");
  c.width = CANVAS_W;
  c.height = CANVAS_H;
  const ctx = c.getContext("2d")!;

  // 天空渐变
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H * 0.6);
  sky.addColorStop(0, "#4facfe");
  sky.addColorStop(1, "#00f2fe");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H * 0.6);

  // 太阳
  ctx.beginPath();
  ctx.arc(CANVAS_W * 0.78, CANVAS_H * 0.22, 28, 0, Math.PI * 2);
  ctx.fillStyle = "#ffe066";
  ctx.fill();

  // 远山
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H * 0.55);
  ctx.quadraticCurveTo(CANVAS_W * 0.25, CANVAS_H * 0.28, CANVAS_W * 0.5, CANVAS_H * 0.5);
  ctx.quadraticCurveTo(CANVAS_W * 0.75, CANVAS_H * 0.32, CANVAS_W, CANVAS_H * 0.52);
  ctx.lineTo(CANVAS_W, CANVAS_H);
  ctx.lineTo(0, CANVAS_H);
  ctx.fillStyle = "#7c6eaa";
  ctx.fill();

  // 草地
  const grass = ctx.createLinearGradient(0, CANVAS_H * 0.6, 0, CANVAS_H);
  grass.addColorStop(0, "#43e97b");
  grass.addColorStop(1, "#38f9d7");
  ctx.fillStyle = grass;
  ctx.fillRect(0, CANVAS_H * 0.6, CANVAS_W, CANVAS_H * 0.4);

  // 草地波浪
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H * 0.6);
  ctx.quadraticCurveTo(CANVAS_W * 0.2, CANVAS_H * 0.55, CANVAS_W * 0.4, CANVAS_H * 0.6);
  ctx.quadraticCurveTo(CANVAS_W * 0.6, CANVAS_H * 0.65, CANVAS_W * 0.8, CANVAS_H * 0.58);
  ctx.quadraticCurveTo(CANVAS_W * 0.95, CANVAS_H * 0.54, CANVAS_W, CANVAS_H * 0.6);
  ctx.lineTo(CANVAS_W, CANVAS_H * 0.65);
  ctx.lineTo(0, CANVAS_H * 0.65);
  ctx.fillStyle = "#38d9a9";
  ctx.fill();

  // 云朵
  drawCloud(ctx, CANVAS_W * 0.15, CANVAS_H * 0.15, 1);
  drawCloud(ctx, CANVAS_W * 0.5, CANVAS_H * 0.1, 0.7);

  // 几棵树
  drawTree(ctx, CANVAS_W * 0.12, CANVAS_H * 0.6, 0.9);
  drawTree(ctx, CANVAS_W * 0.35, CANVAS_H * 0.58, 1.1);
  drawTree(ctx, CANVAS_W * 0.68, CANVAS_H * 0.62, 0.8);
  drawTree(ctx, CANVAS_W * 0.88, CANVAS_H * 0.57, 1);

  return c.toDataURL();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.arc(22, -4, 22, 0, Math.PI * 2);
  ctx.arc(46, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // 树干
  ctx.fillStyle = "#8B5E3C";
  ctx.fillRect(-3, -10, 6, 22);
  // 树冠
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.lineTo(-16, -10);
  ctx.lineTo(16, -10);
  ctx.closePath();
  ctx.fillStyle = "#2d8a4e";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(-12, -26);
  ctx.lineTo(12, -26);
  ctx.closePath();
  ctx.fillStyle = "#34a853";
  ctx.fill();
  ctx.restore();
}

/* ───────── component ───────── */

export default function Glm51SliderCaptchaPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieceRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("等待用户拖动滑块完成图片拼合");
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [sliderX, setSliderX] = useState(0);

  // 拼图目标位置 (只在初始化 / 刷新时确定)
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef({ clientX: 0, sliderX: 0 });

  /* ── 绘制主画布 ── */
  function drawMainCanvas() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    // 绘制拼图遮罩 (缺口)
    const mask = renderPuzzleMask(CANVAS_W, CANVAS_H, targetXRef.current, targetYRef.current);
    ctx.drawImage(mask, 0, 0);
    // 缺口边缘高亮
    puzzlePath(ctx, targetXRef.current, targetYRef.current, PIECE_SIZE, PIECE_R);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* ── 绘制拼图块 ── */
  function drawPieceCanvas(offsetX: number) {
    const canvas = pieceRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const piece = renderPuzzlePiece(img, targetXRef.current, targetYRef.current, offsetX);
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.drawImage(piece, 0, 0);
  }

  /* ── 核心加载逻辑 (异步部分) ── */
  const generateCaptcha = useCallback(() => {
    // 模拟后端请求: 返回背景图 + 拼图目标位置
    setTimeout(() => {
      const dataUrl = generatePlaceholderImage();
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        const tx = randInt(CANVAS_W * 0.45, CANVAS_W - PIECE_SIZE - 20);
        const ty = randInt(10, CANVAS_H - PIECE_SIZE - 10);
        targetXRef.current = tx;
        targetYRef.current = ty;

        drawMainCanvas();
        drawPieceCanvas(0);

        setMessage("message: 等待用户拖动滑块完成图片拼合");
        setLoading(false);
      };
      img.src = dataUrl;
    }, 400);
  }, []);

  /* ── 首次挂载加载 (初始状态已是 loading=true，无需同步 setState) ── */
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  /* ── 刷新验证码 (由用户操作触发) ── */
  function loadCaptcha() {
    setLoading(true);
    setVerified(false);
    setFailed(false);
    setSliderX(0);
    setMessage("message: 已刷新验证码，请重新拖动滑块");
    generateCaptcha();
  }

  /* ── 滑块拖拽 ── */
  function getSliderMaxOffset() {
    if (!trackRef.current) return CANVAS_W - PIECE_SIZE;
    return trackRef.current.clientWidth - 44; // slider button width = 44
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (verified || loading) return;
    e.preventDefault();
    setDragging(true);
    dragStartRef.current = { clientX: e.clientX, sliderX: sliderX };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    e.preventDefault();
    const delta = e.clientX - dragStartRef.current.clientX;
    const maxOff = getSliderMaxOffset();
    const newSliderX = Math.max(0, Math.min(dragStartRef.current.sliderX + delta, maxOff));
    setSliderX(newSliderX);

    // 将滑块偏移映射到拼图块偏移
    const pieceOffset = (newSliderX / maxOff) * (CANVAS_W - PIECE_SIZE);
    drawMainCanvas();
    drawPieceCanvas(pieceOffset);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);

    // 计算拼图块当前 x
    const maxOff = getSliderMaxOffset();
    const pieceX = (sliderX / maxOff) * (CANVAS_W - PIECE_SIZE);
    const delta = Math.abs(pieceX - targetXRef.current);

    if (delta <= TOLERANCE) {
      onVerifySuccess(pieceX);
    } else {
      onVerifyFail(delta);
    }
  }

  /* ── 验证结果 ── */
  function onVerifySuccess(pieceX: number) {
    setMessage(
      `message: { code: 0, msg: "验证通过", captchaId: "glm-5.1", offset: ${Math.round(pieceX)} }`
    );
    setVerified(true);
    setFailed(false);
  }

  function onVerifyFail(delta: number) {
    setMessage(
      `message: { code: 400, msg: "验证失败，请重试", deviation: ${Math.round(delta)}px }`
    );
    setFailed(true);
    setVerified(false);
    // 短暂停顿后重置滑块
    setTimeout(() => {
      setSliderX(0);
      setFailed(false);
      drawMainCanvas();
      drawPieceCanvas(0);
    }, 800);
  }

  /* ── 刷新 ── */
  function handleRefresh() {
    loadCaptcha();
  }

  return (
    <Card
      className="slider-captcha-panel"
      style={{ maxWidth: 400 }}
      styles={{ body: { padding: "16px 20px" } }}
    >
      <Space orientation="vertical" size={12} style={{ width: "100%" }}>
        {/* 标题 */}
        <Typography.Text strong style={{ fontSize: 16 }}>
          GLM-5.1 滑动验证码
        </Typography.Text>

        {/* 验证码画布区域 */}
        <div
          style={{
            position: "relative",
            width: CANVAS_W,
            height: CANVAS_H,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #d7e0ef",
            background: "#dfe7f5",
            userSelect: "none",
          }}
        >
          {/* 主背景 + 遮罩 */}
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          {/* 拼图块 (可拖动) */}
          <canvas
            ref={pieceRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ position: "absolute", top: 0, left: 0 }}
          />

          {/* 验证通过遮罩 */}
          {verified && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(34,197,94,0.35)",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
                borderRadius: 8,
              }}
            >
              验证通过
            </div>
          )}

          {/* 加载中 */}
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                borderRadius: 8,
                fontSize: 14,
                color: "#666",
              }}
            >
              加载中...
            </div>
          )}
        </div>

        {/* 滑块轨道 */}
        <div
          ref={trackRef}
          style={{
            position: "relative",
            width: CANVAS_W,
            height: 44,
            background: failed
              ? "linear-gradient(90deg, #fee2e2, #fecaca)"
              : verified
                ? "linear-gradient(90deg, #bbf7d0, #86efac)"
                : "linear-gradient(90deg, #e0e7ff, #c7d2fe)",
            borderRadius: 22,
            border: failed
              ? "1px solid #fca5a5"
              : verified
                ? "1px solid #86efac"
                : "1px solid #a5b4fc",
            overflow: "hidden",
          }}
        >
          {/* 已划过区域 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: sliderX + 22,
              background: failed
                ? "rgba(239,68,68,0.25)"
                : verified
                  ? "rgba(34,197,94,0.25)"
                  : "rgba(99,102,241,0.2)",
              borderRadius: 22,
              transition: dragging ? "none" : "width 0.3s ease",
            }}
          />

          {/* 提示文字 */}
          {!dragging && !verified && sliderX === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "#6366f1",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              向右拖动滑块完成拼图
            </div>
          )}

          {/* 滑块按钮 */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: "absolute",
              top: 2,
              left: sliderX,
              width: 40,
              height: 40,
              borderRadius: 20,
              background: failed
                ? "#ef4444"
                : verified
                  ? "#22c55e"
                  : "#6366f1",
              cursor: verified ? "default" : "grab",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              transition: dragging ? "none" : "left 0.3s ease, background 0.3s ease",
              touchAction: "none",
            }}
          >
            {/* 滑块箭头图标 */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              {verified ? (
                <path
                  d="M5 10l3 3 7-7"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : failed ? (
                <path
                  d="M7 7l6 6M13 7l-6 6"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path
                    d="M6 4l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 4l6 6-6 6"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* 操作栏 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button size="small" onClick={handleRefresh} disabled={loading}>
            刷新验证码
          </Button>
          <Typography.Text
            type={verified ? "success" : failed ? "danger" : "secondary"}
            style={{ fontSize: 12, maxWidth: 240, wordBreak: "break-all" }}
          >
            {message}
          </Typography.Text>
        </div>
      </Space>
    </Card>
  );
}
