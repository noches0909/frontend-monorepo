import { Button, Card, Space, Typography } from "@acme/ui";
import { useEffect, useMemo, useRef, useState } from "react";

const PIECE_SIZE = 54;
const THUMB_SIZE = 44;
const VERIFY_TOLERANCE = 7;

type CaptchaSeed = {
  targetRatio: number;
  yRatio: number;
  nonce: number;
};

type VerificationState = "idle" | "dragging" | "success" | "error";

type CaptchaMetrics = {
  imageWidth: number;
  imageHeight: number;
  trackWidth: number;
};

const captchaImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 405'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%238cc7d8'/%3E%3Cstop offset='.52' stop-color='%23e9cf8d'/%3E%3Cstop offset='1' stop-color='%23d97161'/%3E%3C/linearGradient%3E%3ClinearGradient id='water' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop stop-color='%23487f94'/%3E%3Cstop offset='1' stop-color='%232c5164'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='720' height='405' fill='url(%23sky)'/%3E%3Ccircle cx='118' cy='92' r='52' fill='%23fff2b8' opacity='.9'/%3E%3Cpath d='M0 166 93 103l56 39 75-74 95 90 84-58 120 78 86-46 111 78v195H0z' fill='%235f806b'/%3E%3Cpath d='M0 208 104 155l98 43 84-34 104 57 97-45 82 47 151-52v234H0z' fill='%233b5e55'/%3E%3Crect y='248' width='720' height='157' fill='url(%23water)'/%3E%3Cpath d='M0 280c72 22 120-13 188 6 75 21 129 18 208-4 68-18 156 10 324-4v127H0z' fill='%233b6e84' opacity='.72'/%3E%3Cg fill='none' stroke='%23f5e2b1' stroke-width='4' opacity='.38'%3E%3Cpath d='M42 316c58-18 124 20 198 0s132 12 202-2 126 10 220-4'/%3E%3Cpath d='M88 354c72 16 132-12 198 4s125-18 194-3 113 5 178-9'/%3E%3C/g%3E%3Cpath d='M526 238c20-41 68-57 113-38 25 11 44 29 64 50-74 2-125-1-177-12z' fill='%23d9c89e' opacity='.9'/%3E%3Cpath d='M541 220c32 22 75 30 139 30' stroke='%23975f4c' stroke-width='5' fill='none' opacity='.65'/%3E%3C/svg%3E";

function createSeed(): CaptchaSeed {
  return {
    targetRatio: 0.48 + Math.random() * 0.36,
    yRatio: 0.28 + Math.random() * 0.34,
    nonce: Date.now()
  };
}

export default function Gpt54SliderCaptchaPanel() {
  const imageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ pointerX: 0, sliderX: 0 });
  const sliderXRef = useRef(0);

  const [seed, setSeed] = useState(createSeed);
  const [sliderX, setSliderX] = useState(0);
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState("message: 等待用户拖动滑块完成图片拼合");
  const [metrics, setMetrics] = useState<CaptchaMetrics>({
    imageWidth: 360,
    imageHeight: 203,
    trackWidth: 320
  });

  const targetLabel = useMemo(
    () => `captcha-${seed.nonce}`,
    [seed.nonce]
  );

  useEffect(() => {
    function syncMetrics() {
      const imageRect = imageRef.current?.getBoundingClientRect();
      const trackRect = trackRef.current?.getBoundingClientRect();

      setMetrics({
        imageWidth: imageRect?.width ?? 360,
        imageHeight: imageRect?.height ?? 203,
        trackWidth: trackRect?.width ?? 320
      });
    }

    syncMetrics();

    const observer = new ResizeObserver(syncMetrics);

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function resolveMetrics(source: CaptchaMetrics) {
    const imageWidth = source.imageWidth;
    const imageHeight = source.imageHeight;
    const trackWidth = source.trackWidth;

    return {
      imageWidth,
      imageHeight,
      maxPieceX: Math.max(1, imageWidth - PIECE_SIZE),
      maxSliderX: Math.max(1, trackWidth - THUMB_SIZE),
      targetX: seed.targetRatio * Math.max(1, imageWidth - PIECE_SIZE),
      targetY: seed.yRatio * Math.max(1, imageHeight - PIECE_SIZE)
    };
  }

  function getLiveMetrics() {
    const imageRect = imageRef.current?.getBoundingClientRect();
    const trackRect = trackRef.current?.getBoundingClientRect();

    return resolveMetrics({
      imageWidth: imageRect?.width ?? metrics.imageWidth,
      imageHeight: imageRect?.height ?? metrics.imageHeight,
      trackWidth: trackRect?.width ?? metrics.trackWidth
    });
  }

  function resetCaptcha() {
    setSeed(createSeed());
    sliderXRef.current = 0;
    setSliderX(0);
    setState("idle");
    setMessage("message: 已刷新验证码，请重新拖动滑块");
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (state === "success") {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerX: event.clientX,
      sliderX
    };
    setState("dragging");
    setMessage("message: 正在校验滑块轨迹...");
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (state !== "dragging") {
      return;
    }

    const { maxSliderX } = getLiveMetrics();
    const nextX = dragStartRef.current.sliderX + event.clientX - dragStartRef.current.pointerX;
    const nextSliderX = Math.min(maxSliderX, Math.max(0, nextX));

    sliderXRef.current = nextSliderX;
    setSliderX(nextSliderX);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (state !== "dragging") {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const { maxPieceX, maxSliderX, targetX } = getLiveMetrics();
    const pieceX = (sliderXRef.current / maxSliderX) * maxPieceX;
    const delta = Math.abs(pieceX - targetX);

    if (delta <= VERIFY_TOLERANCE) {
      const alignedSliderX = maxSliderX * (targetX / maxPieceX);

      setState("success");
      sliderXRef.current = alignedSliderX;
      setSliderX(alignedSliderX);
      setMessage(
        `message: { code: 0, msg: "验证通过", captchaId: "${targetLabel}", offset: ${Math.round(pieceX)} }`
      );
      return;
    }

    setState("error");
    sliderXRef.current = 0;
    setSliderX(0);
    setMessage(
      `message: { code: 400, msg: "验证失败，请重试", deviation: ${Math.round(delta)}px }`
    );
  }

  const { imageWidth, imageHeight, maxPieceX, maxSliderX, targetX, targetY } =
    resolveMetrics(metrics);
  const pieceX = (sliderX / maxSliderX) * maxPieceX;
  const imagePosition = `${-pieceX}px ${-targetY}px`;
  const isSuccess = state === "success";

  return (
    <Card className="slider-captcha-panel" styles={{ body: { padding: 20 } }}>
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              gpt-5.4
            </Typography.Title>
            <Typography.Text type="secondary">
              拖动滑块，让拼图块对齐缺口
            </Typography.Text>
          </div>
          <Button onClick={resetCaptcha}>刷新</Button>
        </Space>

        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            ref={imageRef}
            aria-label="滑动验证码图片"
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              width: "100%",
              overflow: "hidden",
              borderRadius: 8,
              backgroundImage: `url("${captchaImage}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              boxShadow: "inset 0 0 0 1px rgba(15, 23, 42, 0.1)"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: targetX,
                top: targetY,
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                borderRadius: "12px 18px 10px 18px",
                background: "rgba(15, 23, 42, 0.28)",
                boxShadow:
                  "inset 0 0 0 2px rgba(255, 255, 255, 0.72), 0 0 16px rgba(15, 23, 42, 0.28)"
              }}
            />
            <div
              style={{
                position: "absolute",
                left: pieceX,
                top: targetY,
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                borderRadius: "12px 18px 10px 18px",
                backgroundImage: `url("${captchaImage}")`,
                backgroundPosition: imagePosition,
                backgroundSize: `${imageWidth}px ${imageHeight}px`,
                border: "2px solid rgba(255, 255, 255, 0.92)",
                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.3)",
                opacity: isSuccess ? 0.88 : 1,
                transition: state === "dragging" ? "none" : "left 180ms ease"
              }}
            />
          </div>

          <div
            ref={trackRef}
            style={{
              position: "relative",
              height: 46,
              marginTop: 14,
              borderRadius: 8,
              background: isSuccess ? "#e9f8ef" : "#f1f5f9",
              boxShadow: "inset 0 0 0 1px rgba(15, 23, 42, 0.1)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: sliderX + THUMB_SIZE / 2,
                height: "100%",
                background: isSuccess ? "#b7ebc6" : "#dbeafe",
                transition: state === "dragging" ? "none" : "width 180ms ease"
              }}
            />
            <Typography.Text
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isSuccess ? "#237804" : "#475569",
                fontSize: 13,
                pointerEvents: "none"
              }}
            >
              {isSuccess ? "验证通过" : "按住滑块向右拖动"}
            </Typography.Text>
            <button
              type="button"
              aria-label="拖动滑块完成验证"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                position: "absolute",
                top: 1,
                left: sliderX,
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                border: 0,
                borderRadius: 8,
                cursor: isSuccess ? "default" : "grab",
                touchAction: "none",
                color: "#fff",
                fontSize: 22,
                lineHeight: 1,
                background: isSuccess ? "#52c41a" : "#1677ff",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
                transition: state === "dragging" ? "none" : "left 180ms ease, background 160ms ease"
              }}
            >
              {isSuccess ? "✓" : "›"}
            </button>
          </div>
        </div>

        <Typography.Text type={state === "error" ? "danger" : isSuccess ? "success" : "secondary"}>
          {message}
        </Typography.Text>
      </Space>
    </Card>
  );
}
