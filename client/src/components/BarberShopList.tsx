import React, {useEffect, useState} from "react";
import { IBarberShop } from "../types/barberShop";
import { getBarberShops } from "../services/api";

const BarberShopList : React.FC = () => {
    const [shops, setShops] = useState<IBarberShop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadShops();
    },[]);  

    const loadShops = async () => {
        try{
            setLoading(true);
            const response = await getBarberShops();
            setShops(response.data);
        } catch(err: any){
            setError("Dukkanlar yuklenirken hata olustu");
            console.error(err);
        } finally{
            setLoading(false);
        }
    };

    if(loading) return <div style={centerStyle}>Dukkanlar yukleniyor lutfen bekleyin</div>;
    if (error) return <div style={{color:'red', textAlign:'center'}}>{error}</div>;

    return(
        <div style={{padding:'20px'}}>
            <h2 style={{textAlign:'center', marginBottom:'30px'}}>Berber Dukkanlari</h2>
            <div style={gridStyle}>
                {shops.length > 0 ? (
                    shops.map((shop) => (
                        <div key = {shop.id} style={cardStyle}>
                            <h3>{shop.name}</h3>
                            <p>{shop.address || 'Adres belirtilmemis'}</p>
                            <p>{shop.phoneNumber || 'Telefon numarasi belirtilmemis'}</p>

                            <button
                                onClick={() => window.location.href = `/book/${shop.id}`}
                                style={buttonStyle}
                                >
                                    Randevu Al
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Sistemde henuz kayitli dukkan yok</p>
                )}

            </div>
        </div>
    );
};

const gridStyle : React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    gap:'20px'
};

const cardStyle : React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding:'15px',
    boxShadow:'0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor:'#0c1414',
    textAlign:'center'
};

const buttonStyle : React.CSSProperties = {
    backgroundColor : '#211b6b',
    color:'white',
    border:'none',
    padding:'10px 20px',
    borderRadius:'5px',
    cursor:'pointer',
    marginTop:'10px',
    width:'100%'
};

const centerStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:'200px'
};

export default BarberShopList;