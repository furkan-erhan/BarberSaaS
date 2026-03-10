import React,{useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarbersByShops, createAppointment } from "../services/api";
import { IEmployee } from "../types/employee";

const BookingPage : React.FC = () => {
    const {shopId} = useParams<{shopId: string}>();
    const navigate = useNavigate();

    const [barbers, setBarbers] = useState<IEmployee[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(shopId) loadBarbers();
    },[shopId]);

    const loadBarbers = async () => {
        try{
            setLoading(true);
            const response = await getBarbersByShops(shopId!);
            setBarbers(response.data);
        } catch(err: any) {
            console.error("Hata:", err.response?.data);
            const errorMsg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : (err.response?.data?.title || "Randevu alınamadı !");
            alert("Hata: " + errorMsg);
        } finally{
            setLoading(false);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!selectedBarber || !startTime){
            alert("Berber ve saat secmelisin !");
            return;
        }
        try{
            await createAppointment({
                barberShopId: shopId!,
                employeeId: selectedBarber,
                startTime: startTime
            });
            alert("Randevu basariyla alindi !");
            navigate('/my-appointments');
        } catch(err: any){
            const errorMsg = err.response?.data || "Randevu alinamadi !";
            alert("Hata: " + errorMsg);
        }
    };

    if(loading) return <div style={{textAlign: 'center', padding: '50px'}}>Berberler aranıyor...</div>;

    return(
        <div style={containerStyle}>
            <h2>Randevu Oluştur</h2>
            <p style={{color: '#aaa'}}>Dükkan ID: {shopId}</p>

            <form onSubmit={handleBooking} style={formStyle}>
                <label>Berber Seç:</label>
                <select 
                    value={selectedBarber} 
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    style={inputStyle}
                    required
                >
                    <option value="">-- Bir Berber Seç --</option>
                    {barbers.map(barber => (
                        <option key={barber.id} value={barber.id}>
                            {barber.firstName} {barber.lastName}
                        </option>
                    ))}
                </select>

                <label>Tarih ve Saat:</label>
                <input 
                    type="datetime-local" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={inputStyle}
                    required
                />

                <p style={infoText}>* Her randevu standart 40 dakikadır .</p>

                <button type="submit" style={buttonStyle}>
                    Randevuyu Onayla 
                </button>
            </form>
        </div>
    );
};

const containerStyle: React.CSSProperties = { maxWidth: '500px', margin: '40px auto', padding: '20px', backgroundColor: '#242424', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#333', color: 'white' };
const buttonStyle: React.CSSProperties = { backgroundColor: '#0f638a', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' };
const infoText: React.CSSProperties = { fontSize: '0.85rem', color: '#888', fontStyle: 'italic' };

export default BookingPage;