import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.scss'
import Alerts from '../components/users/alerts';
import { useState, useEffect, useRef, useCallback } from 'react';
// import Earth from '../components/earth';
import CountryData from '../components/country_data';
import TopDiseases from '../components/home_overlay';

  const latestContinent = "";
export default function Home({ cData }) {
  function Earth () {
    const Globe = dynamic(import('react-globe.gl'), { ssr: false });
    const globeEl = useRef();
    const showOverlay = useCallback((polygon, { lat: endLat, lng: endLng }) => {
      // get the contient the clicked on country is on
      console.log(polygon.properties.CONTINENT)
  
      // Move camera to center in on that country
      console.log(endLat)
      console.log(endLng)
  
      // Update/Create overlay of top 3 dieseases
      latestContinent = polygon.properties.CONTINENT
      setDiseases(diseases.filter((disease) => disease.id !== 1))
    });
  
    const [countries, setCountries] = useState({ features: []});
    const [transitionDuration, setTransitionDuration] = useState(1000);
  
    useEffect(() => {
      // load data
      fetch('/countries.geojson').then(res => res.json())
      .then(countries=> {
        setCountries(countries);
  
          setTimeout(() => {
            setTransitionDuration(4000);
          }, 3000);
        });
    }, []);
  
  
    return <div>
      <Globe
        globeImageUrl="/images/earth-blue-marble.jpg"
        backgroundImageUrl='/images/night-sky.png'
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.4)'}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
        `}
        polygonsTransitionDuration={transitionDuration}
        onPolygonClick={showOverlay}
      />;
    </div>
  };
  const [diseases, setDiseases] = useState([
    {
        id: 1,
        name: "Covid-19"
    },
    {
        id: 2,
        name: "yeah nah"
    },
    {
        id: 3,
        name: "420 69 nice"
    }
  ]);

  return (
    <div className={styles.main}>
      
      <div className={styles.earth}>
        <Earth />
      </div>

      <div className={styles.sidebar}> 
        <CountryData countryData={"Country"}/> 
      </div>
      
      <div className={styles.overlay}>
        <TopDiseases continent={latestContinent} diseases={diseases}/>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  // get all the required covid data
  // and other data

  return {
    props: {
      cData: { 'test': true },
      // countries: countries
    }
  };
}
