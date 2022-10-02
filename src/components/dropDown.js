import React, { useState, useEffect, useRef, } from 'react';
import db from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import InfiniteScroll from 'react-infinite-scroll-component';
import data from '../MOCK_DATA.json'
import Swal from "sweetalert2";

const DropDown = () => {
    const [ListOfUsers, setListOfUsers] = useState([]);
    const [lastKey, setLastKey] = useState();
    const [isLoading, setLoading] = useState(false);
    const [isEmpty, setEmpty] = useState(false);
    const listInnerRef = useRef()
    const [keys, setKeys] = useState([])
    const [objQuery, setObjQuery] = useState({ key: '', value: '' })
    const userRef = db.collection('usuarios');

    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState(20)

    useEffect(() => {
        updateState(/*collections*/);
        userRef.limit(1).get().then((collections) => {
        });
        const fetchData = async () => {
            const data = await db.collection("usuarios").get();
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFiltered(
            users/*data*/.filter(
            (user) =>
                (objQuery.key === 'nombre' && user.nombre.toLowerCase().includes(search.toLowerCase())) ||
                (objQuery.key === 'razon_social' && user.razon_social.toLowerCase().includes(search.toLowerCase())) ||
                (objQuery.key === 'telefono' && user.telefono.toLowerCase().includes(search.toLowerCase())) ||
                (objQuery.key === 'nit' && user.nit.toLowerCase().includes(search.toLowerCase())) ||
                (objQuery.key === 'codigo' && user.codigo.toLowerCase().includes(search.toLowerCase()))
        ).slice(0, items)
        )
        if (search.length === 0) {
            setFiltered([])
        }
    }, [search,  users,  items,]);

    const updateState = (collections) => {
        const isCollectionEmpty = /*collections.size*/data.length === 0;
        if (!isCollectionEmpty) {
            const usuar = /*collections.docs*/data.map((us) => us);
            const Lastdoc = /*collections.docs*/data[/*collections.docs*/data.length - 1];
            setListOfUsers((ListOfUsers) => [...ListOfUsers, ...usuar]);
            setLastKey(Lastdoc);
            const objectKeys = Object.keys(usuar[0]).filter(o => o !== "id");
            setKeys(objectKeys)

        } else {
            setEmpty(true);
        }
        setLoading(false);
    }

    function handleSelect(e) {
        const selectedValue = e.target.value;
        setObjQuery({ ...objQuery, key: selectedValue })
    }

    function handleChange(e) {
        const selectedValue = e.target.value;
        setObjQuery({ ...objQuery, value: selectedValue })
    }

    const handleForm = () => {
        search === '' ? Swal.fire('Inserte un nombre', '', 'error') :
            Swal.fire({
                title: 'Agregue un nuevo usuario',
                html: `<input id="swal-input1" class="swal2-input" value=${search} placeholder="nuevo usuario..."><div id="recaptcha"></div>
            <input id="swal-input2" class="swal2-input" placeholder="nueva razon social..."><div id="recaptcha"></div>
            <input id="swal-input3" class="swal2-input" placeholder="nuevo nit..."><div id="recaptcha"></div>  
            <input id="swal-input4" class="swal2-input" placeholder="nuevo telefono..."><div id="recaptcha"></div>
            <input id="swal-input5" class="swal2-input" placeholder="nuevo codigo..."><div id="recaptcha"></div>`,
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const nombre = document.getElementById('swal-input1').value
                    const razon_social = document.getElementById('swal-input2').value
                    const nit = document.getElementById('swal-input3').value
                    const telefono = document.getElementById('swal-input4').value
                    const codigo = document.getElementById('swal-input5').value
                    return {
                        nombre,
                        razon_social,
                        nit,
                        telefono,
                        codigo
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (!result.nombre ||
                    !result.razon_social ||
                    !result.nit ||
                    !result.telefono ||
                    !result.codigo
                ) {
                    Swal.fire("Complete todos los campos", "", "warning")
                }
                else if (result.isConfirmed) {
                    data.push(result.value)
                    Swal.fire("Usuario agregado", "", "success")
                } else if (result.isDismissed) {
                    Swal.fire("Operacion cancelada", "", "error");
                }
            })
        setSearch('')
    }

    const errorSearch = () => {
        Swal.fire('Selecciona un atributo <br/> para escribir', '', 'error')
    }

    return (<InfiniteScroll dataLength={filtered.length}
        next={() => setItems(prev => prev + 20)}
        hasMore={true}
        endMessage={
            <p style={{ textAlign: 'center' }}>
                <b>No hay mas coincidencias</b>
            </p>
        }>

        <div className="App" ref={listInnerRef} style={{ overflowY: "auto", margin: '1rem 0 2rem 0' }} >
            <h3> Buscador de usuarios</h3>
            <div className="wrapper" >
                <select onChange={handleSelect} >
                    <option value="">Selecciona un atributo atributo</option>
                    {keys.map(k => (
                        <option value={k} key={k}>{k}</option>
                    ))}
                </select>
                <div>
                    <input type="text" placeholder='Buscar usuario...        🔍' onChange={(e) => setSearch(e.target.value)} />
                </div>
                {search.length >= 1 && objQuery.key === "" ?
                    errorSearch() : (
                        <div className="fix_option" style={{ display: search === '' ? 'none' : 'block' }}>
                            <h5>{search} <button onClick={handleForm} className="add_button"><span>Agregar</span></button></h5>
                        </div>)}
                {filtered.length > 0 && filtered.map((item, index) => (
                    <div key={index} >
                        <div className="wrapper_list">
                            <p><b> Nombre : </b> {item.nombre} 🙍🏻‍♀️</p>
                            <p><b> Razon social : </b>{item.razon_social} 🏭</p>
                            <p><b> Telefono : </b>{item.telefono} 📞</p>
                            <p><b> NIT : </b>{item.nit} 📊</p>
                            <p><b> Codigo : </b>{item.codigo} 🌐</p>
                        </div>
                    </div>
                ))}
                {isLoading && <h1> Loading... </h1>}
                {/* {!isLoading && !isEmpty && <button onClick={() => fetchMorePosts()} className="btn__default">Mostrar mas usuarios</button>} */}
                {isEmpty && <h1> There are no more data </h1>}
            </div>
        </div>
    </InfiniteScroll>)
}
export default DropDown