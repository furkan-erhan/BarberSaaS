import React, { useEffect, useState } from "react";
import {login, register} from '../services/api';


const Auth = ({onLoginSuccess} : {onLoginSuccess: () => void}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({firstName:'', lastName:'', email:'', password:''});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try{
            const response = isLogin ? await login(formData) : await register(formData);

            if(isLogin){
                localStorage.setItem('token', response.data.token);
                alert('Kullanici girisi basarili !');
                onLoginSuccess();
            }else {
                alert('Kullanici kaydi basarili');
                setIsLogin(true);
            }
        } catch(error: any){
            handleAuthError(error);
        }
    };

    const handleAuthError = (error: any) => {
        const errorData = error.response?.data;
        if (Array.isArray(errorData)) {
            const messages = errorData.map((err: any) => err.description).join('\n');
            alert('Hata var :\n' + messages);
        } else {
            alert('Hata var : ' + (errorData?.title || errorData || "Bilinmeyen hata"));
        }
    };

    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" placeholder="Ad" onChange={(e) => setFormData({...formData, firstName: e.target.value})} /><br/>
              <input type="text" placeholder="Soyad" onChange={(e) => setFormData({...formData, lastName: e.target.value})} /><br/>
            </>
         )}
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} /><br/>
            <input type="password" placeholder="Şifre" onChange={(e) => setFormData({...formData, password: e.target.value})} /><br/>
            <button type="submit">{isLogin ? 'Giriş' : 'Kayıt'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px' }}>
          {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
         </button>
        </div>
    );
};

export default Auth;