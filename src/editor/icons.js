// Lucide icons used by the standalone editor (editor.html).
// The Vite plugin in vite.config.js inlines only these icons at build time,
// so the editor ships no icon runtime and makes no extra requests.
import {
  AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignStartHorizontal,
  AlignStartVertical, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, ArrowDown,
  ArrowUp, Blend, Bookmark, BringToFront, Check, ChevronLeft, ChevronRight, Circle, Columns2, Copy, CopyPlus, Crop,
  Download, Ellipsis, Eraser, Film, FlipHorizontal2, FlipVertical2, GalleryHorizontal, GripHorizontal, Group, Heart,
  Image, ImageOff, ImagePlus, Images, Layers, LayoutDashboard, Maximize, Maximize2, MessageCircle, Minimize2, Minus,
  Moon, PanelRight, PictureInPicture2, Play, Plus, Redo2, Replace, RotateCcw, RotateCw, Rows2, Search, Send, SendToBack, Shapes,
  SlidersHorizontal, Square, SquareDashed, SquareDashedMousePointer, SquarePlus, TextAlignCenter, TextAlignEnd,
  TextAlignStart, Trash2, Type, Undo2, Ungroup, Upload, X,
} from 'lucide'

export const EDITOR_ICONS = {
  // app chrome
  rotate: RotateCw, undo: Undo2, redo: Redo2, play: Play, plus: Plus, x: X, done: Check, check: Check, download: Download,
  upload: Upload, search: Search, moon: Moon, grip: GripHorizontal, dock: PanelRight, float: PictureInPicture2,
  back: ChevronLeft, mvl: ChevronLeft, mvr: ChevronRight,
  // tool bar
  text: Type, photo: ImagePlus, shape: Shapes, line: Minus, lay: LayoutDashboard, slides: GalleryHorizontal,
  lyr: Layers, multi: SquareDashedMousePointer,
  // object actions
  dup: Copy, del: Trash2, front: BringToFront, bottom: SendToBack, fwd: ArrowUp, bwd: ArrowDown,
  group: Group, ungroup: Ungroup, reset: RotateCcw, all: Images,
  al_l: AlignStartVertical, al_c: AlignCenterVertical, al_r: AlignEndVertical,
  al_t: AlignStartHorizontal, al_m: AlignCenterHorizontal, al_b: AlignEndHorizontal,
  ta_l: TextAlignStart, ta_c: TextAlignCenter, ta_r: TextAlignEnd,
  tv_t: AlignVerticalJustifyStart, tv_c: AlignVerticalJustifyCenter, tv_e: AlignVerticalJustifyEnd,
  // media
  replace: Replace, crop: Crop, fit: Minimize2, fill: Maximize2, flx: FlipHorizontal2, fly: FlipVertical2,
  sph: Columns2, spv: Rows2, circ: Circle, unset: ImageOff, brush: Eraser, edge: Maximize,
  frame: SquareDashed, slide: Square, image: Image, video: Film, adjust: SlidersHorizontal, blend: Blend,
  // slides
  addsl: SquarePlus, dupsl: CopyPlus, delsl: Trash2,
  // social preview
  heart: Heart, comment: MessageCircle, send: Send, save: Bookmark, more: Ellipsis,
}

const attrs = (a) => Object.entries(a).map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ')

/** Inner SVG markup for an icon node (Lucide ships nodes as [tag, attrs][]). */
export const iconInner = (node) => node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('')

export const editorIconMarkup = () =>
  Object.fromEntries(Object.entries(EDITOR_ICONS).map(([name, node]) => [name, iconInner(node)]))
