import { useRouter } from "next/router";
import { PageTemplate, DishList } from "@/components";
import Styles from "../../styles/discovery.module.css";
import { api } from "@/services";
import { CityPros, PageDiscoverProps, ParamStaticProps } from "@/types";

export default function Descobrir(props: PageDiscoverProps) {
  const { city } = props;

  return (
    <PageTemplate>
      <div className={Styles.content}>
        <h1>Opções na região de {city.name}</h1>
        <p>Encontramos {city.catalogEstimated} opções</p>
        <div className={Styles.items}>
          <DishList citySlug={city.slug} />
        </div>
      </div>
    </PageTemplate>
  );
}

export async function getStaticPaths() {
  const response = await api.get("/cities");
  const cities = response.data;

  const urls = cities.map((city: CityPros) => ({
    params: {
      city: city.slug,
    },
  }));

  return {
    paths: urls,
    fallback: false,
  };
}

export async function getStaticProps({ params }: ParamStaticProps) {
  const citySlug = params?.city as string;
  const response = await api.get(`/cities?cityslug=${citySlug}`);

  const city = response.data;

  return {
    props: {
      city,
    },
    revalidate: 30, //revalidate after 30 seconds
  };
}
