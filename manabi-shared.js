import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './manabi-config.js';
export const configured = SUPABASE_URL.startsWith('https://') && !SUPABASE_PUBLISHABLE_KEY.startsWith('PASTE_');
const store={
  getItem:k=>localStorage.getItem(k)??sessionStorage.getItem(k),
  setItem:(k,v)=>{const keep=localStorage.getItem('manabi_keep')!=='no';if(keep){localStorage.setItem(k,v);sessionStorage.removeItem(k)}else{sessionStorage.setItem(k,v);localStorage.removeItem(k)}},
  removeItem:k=>{localStorage.removeItem(k);sessionStorage.removeItem(k)}
};
export const db=configured?createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{storage:store,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
export const $=id=>document.getElementById(id);
export const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const time=x=>x?new Date(x).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
export function keepSession(v){localStorage.setItem('manabi_keep',v?'yes':'no')}
export const errorText=e=>e?.message||String(e||'処理に失敗しました');
export function flash(message,type='info'){$('message').textContent=message;$('message').className='flash '+type;}
export async function authView(onLogin){if(!configured){$('app').innerHTML='<section class="card"><h2>初期設定が必要です</h2><p>manabi-config.js にSupabaseのURLとPublishable keyを設定してください。まだ実データは利用できません。</p></section>';return null}const {data:{user},error}=await db.auth.getUser();if(error){flash(errorText(error),'error')}if(user){await onLogin(user);return user}return null}
export async function login(email,password,keep){keepSession(keep);const {data,error}=await db.auth.signInWithPassword({email,password});if(error)throw error;return data.user}
export async function logout(){const {error}=await db.auth.signOut();if(error)throw error;location.reload()}
