import { Space } from "@acme/ui";
import Glm51SliderCaptchaPanel from "./Glm51SliderCaptchaPanel";
import Gpt54SliderCaptchaPanel from "./Gpt54SliderCaptchaPanel";

export default function SliderCaptchaComparisonPage() {
  return (
    <Space orientation="vertical" size={16} className="slider-captcha-page">
      <Gpt54SliderCaptchaPanel />
      <Glm51SliderCaptchaPanel />
    </Space>
  );
}
