import {useState,useEffect,useContext} from 'react'
import getGifs from 'services/getGifs'
import GifsContext from 'context/GifsContext'

const INITIAL_PAGE = 0

export function useGifs ({keyword, rating} = {keyword: null}){
    const [loading, setLoading] = useState(false)
    const [loadingNextPage, setLoadingNextPage] = useState(false)
    const [page, setPage] = useState(INITIAL_PAGE)
    const {gifs,setGifs} = useContext(GifsContext)
    
    const keywordToUse = keyword || localStorage.getItem('lastKeyword') || 'random'
    
    useEffect(function(){
        setLoading(true)
        getGifs({keyword: keywordToUse, rating})
            .then(gifs => {
                setGifs(gifs)
                setLoading(false)
                if (keyword != null) localStorage.setItem('lastKeyword', keyword)
            })
    },[keyword,keywordToUse,setGifs, rating])

    useEffect(function(){
        if(page === INITIAL_PAGE) return 
        setLoadingNextPage(true)

        getGifs({keyword: keywordToUse, page, rating})
            .then(nextGifs => {
                setGifs(prevGifs => prevGifs.concat(nextGifs))
                setLoadingNextPage(false)
            })
    },[page, keywordToUse, setGifs, rating])

    return {loading,gifs,setPage, loadingNextPage}

}