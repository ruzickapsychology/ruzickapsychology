import type { SVGProps } from "react";

export type Botanical = "rose" | "cosmos" | "fern";

function Leaf({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path
        d="M0 0C-25-4-43-23-49-45C-22-46-3-23 0 0Z"
        fill="currentColor"
        fillOpacity=".065"
      />
      <path
        d="M0 0-49-45M-8-8-23-9M-17-16-33-20M-25-24-37-32M-11-10-10-24M-23-22-24-35"
        opacity=".65"
      />
    </g>
  );
}

/** Original vector botanical studies; no network images or animation. */
export function BotanicalStudy({
  botanical,
  ...props
}: { botanical: Botanical } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-slot="botanical-study"
      {...props}
    >
      {botanical === "rose" ? (
        <g>
          <path d="M189 352C209 298 207 239 197 192M201 280C167 272 146 253 132 225M204 310C233 295 248 269 253 244M202 227C223 213 245 190 251 166" />
          <Leaf transform="translate(176 270) rotate(-9) scale(1.2)" />
          <Leaf transform="translate(161 257) rotate(72) scale(.8)" />
          <Leaf transform="translate(225 292) rotate(112) scale(1.2)" />
          <Leaf transform="translate(241 273) rotate(31) scale(.7)" />
          <Leaf transform="translate(223 211) rotate(105) scale(.75)" />
          <path
            d="M184 190 178 206 195 196 205 210 210 187M249 172C229 156 238 134 254 128C270 143 269 163 249 172Z"
            fill="currentColor"
            fillOpacity=".08"
          />
          <path d="M249 172C260 153 246 143 254 128M246 171 241 181 253 175 259 180 260 165" />
          <g transform="translate(193 130)">
            <path
              d="M-6 65C-36 72-65 52-68 25C-91 4-80-29-54-36C-51-66-24-78 0-64C28-80 58-63 62-39C88-28 92 2 72 22C75 52 44 73 19 62C9 70 1 68-6 65Z"
              fill="currentColor"
              fillOpacity=".055"
            />
            <path d="M-54-36C-54-14-37 0-23 5M0-64C-19-49-22-28-13-17M62-39C38-41 23-23 20-10M72 22C46 7 26 11 15 25M19 62C25 44 12 24-2 21M-68 25C-42 19-23 29-18 48M-6 65C-10 46-32 36-44 40" />
            <path d="M-13-17C-34-31-57-20-49 3C-58 24-38 43-18 33C-7 51 17 46 25 27C48 27 58 7 41-9C48-32 24-48 7-33C-3-38-17-33-13-17Z" />
            <path d="M-13-17C-22-1-15 14-2 21M-49 3C-32-3-20 1-15 14M7-33C4-15 15-9 26-5M41-9C26-5 24 10 25 27M-18 33C-6 29-2 21-3 11M-13-17C-2-25 12-17 8-6C24-6 24 11 11 16C2 31-13 19-10 10C-24 1-18-14-6-12M-6-12C8-17 14-2 3 2C-6 10-13 0-6-5" />
            <path
              d="m-44-42-5-8m16-1-4-9m-32 42-9-3m15 16-10 1m6 37-7 5m24 11-5 9m27 2-1 8m45-15 6 6m9-23 8 2m-1-44 7-4m-27-22 3-10"
              opacity=".4"
            />
          </g>
        </g>
      ) : botanical === "cosmos" ? (
        <g>
          <path d="M195 354C199 295 188 243 165 182M194 309C221 267 238 211 254 149M190 275C166 259 144 246 126 222M215 267C248 258 266 244 281 225" />
          <path
            d="m183 279-39-40m39 40-45-19m45 19-19-45m48 1 32-38m-32 38 44-17m-44 17 11-48m12 99 44-31m-44 31 49-10m-49 10 26-39m-68 42-34-37m34 37-44-15m44 15-15-44"
            opacity=".65"
          />
          {[
            { x: 158, y: 142, scale: 1 },
            { x: 261, y: 112, scale: 0.69 },
          ].map(({ x, y, scale }) => (
            <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} transform={`rotate(${i * 45})`}>
                  <path
                    d="M-6-11C-20-22-31-43-20-54L-13-51-8-59 0-55 8-58 14-50 21-52C27-34 17-20 6-11Z"
                    fill="currentColor"
                    fillOpacity={i % 2 ? ".035" : ".085"}
                  />
                  <path d="M-3-16-9-44M3-17 8-45M0-25 0-48" opacity=".38" />
                </g>
              ))}
              <circle r="14" fill="currentColor" fillOpacity=".14" />
              {Array.from({ length: 13 }, (_, i) => (
                <circle
                  key={i}
                  cx={Math.cos(i * 2.4) * Math.sqrt(i) * 3}
                  cy={Math.sin(i * 2.4) * Math.sqrt(i) * 3}
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
              ))}
            </g>
          ))}
          <path
            d="M124 223C103 216 105 196 117 191C132 195 138 210 124 223ZM278 230C268 218 273 205 286 202C297 214 293 226 278 230Z"
            fill="currentColor"
            fillOpacity=".1"
          />
        </g>
      ) : (
        <g>
          <path d="M170 359C185 285 211 176 248 60M181 315C158 267 132 219 106 172M190 279C225 263 269 231 291 203" />
          {Array.from({ length: 12 }, (_, i) => {
            const y = 295 - i * 18;
            const x = 184 + i * 5;
            const scale = (1 - i / 17) * 0.97;
            return (
              <g key={i}>
                <Leaf
                  transform={`translate(${x} ${y}) rotate(-18) scale(${scale})`}
                />
                <Leaf
                  transform={`translate(${x + 1} ${y - 7}) rotate(104) scale(${scale})`}
                />
              </g>
            );
          })}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <Leaf
                transform={`translate(${175 - i * 10} ${300 - i * 18}) rotate(-48) scale(${0.53 - i * 0.045})`}
              />
              <Leaf
                transform={`translate(${171 - i * 10} ${294 - i * 18}) rotate(60) scale(${0.53 - i * 0.045})`}
              />
            </g>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <Leaf
                transform={`translate(${211 + i * 15} ${266 - i * 11}) rotate(26) scale(${0.5 - i * 0.06})`}
              />
              <Leaf
                transform={`translate(${216 + i * 15} ${263 - i * 11}) rotate(140) scale(${0.5 - i * 0.06})`}
              />
            </g>
          ))}
          <path
            d="M241 82C234 67 244 50 255 42C259 61 251 74 241 82ZM103 173C88 167 84 154 87 144C101 148 107 160 103 173Z"
            fill="currentColor"
            fillOpacity=".07"
          />
        </g>
      )}
    </svg>
  );
}
