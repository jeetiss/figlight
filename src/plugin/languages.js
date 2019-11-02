import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import go from 'highlight.js/lib/languages/go';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import kotlin from 'highlight.js/lib/languages/kotlin';
import clojure from 'highlight.js/lib/languages/clojure';

export const languages = [
  ['html, xml', xml],
  ['css', css],
  ['scss', scss],
  ['javascript, jsx', js],
  ['go', go],
  ['c++', cpp],
  ['bash', bash],
  ['java', java],
  ['json', json],
  ['markdown', markdown],
  ['php', php],
  ['plaintext', plaintext],
  ['python', python],
  ['ruby', ruby],
  ['rust', rust],
  ['scala', scala],
  ['sql', sql],
  ['swift', swift],
  ['typescript', typescript],
  ['kotlin', kotlin],
  ['clojure', clojure],
].sort((a, b) => a[0].localeCompare(b[0]));
