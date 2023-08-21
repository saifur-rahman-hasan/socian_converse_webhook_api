interface ElasticQuery {
    index: string;
    body: any;
}

interface PrismaCondition {
    [key: string]: any;
}

type SortOrder = 'asc' | 'desc';

class PrismaToElasticQueryBuilder {
    private query: ElasticQuery;

    constructor() {
        this.query = {
            index: '',
            body: {},
        };
    }

    setIndex(index: string): PrismaToElasticQueryBuilder {
        this.query.index = index;
        return this;
    }

    where(condition: PrismaCondition): PrismaToElasticQueryBuilder {
        const shouldClauses = Object.entries(condition).map(([field, value]) => ({
            match: { [field]: value },
        }));

        this.query.body.query = {
            bool: {
                should: shouldClauses,
            },
        };

        return this;
    }


    orderBy(field: string, order: SortOrder = 'asc'): PrismaToElasticQueryBuilder {
        this.query.body.sort = {
            [field]: order,
        };
        return this;
    }

    withQuery(query: any): PrismaToElasticQueryBuilder {
        this.query.body.query = query;
        return this;
    }

    limit(limit: number): PrismaToElasticQueryBuilder {
        this.query.body.size = limit;
        return this;
    }

    offset(offset: number): PrismaToElasticQueryBuilder {
        this.query.body.from = offset;
        return this;
    }

    paginate(page: number, perPage: number): PrismaToElasticQueryBuilder {
        const offset = (page - 1) * perPage;
        return this.offset(offset).limit(perPage);
    }

    update(updateFields: PrismaCondition): PrismaToElasticQueryBuilder {
        this.query.body.script = {
            source: `
                for (def entry : ctx._source.entrySet()) {
                  if (params.update.containsKey(entry.getKey())) {
                    entry.setValue(params.update.get(entry.getKey()));
                  }
                }
              `,
            lang: 'painless',
            params: {
                update: updateFields,
            },
        };

        return this;
    }

    build(): ElasticQuery {
        return this.query;
    }

}

export default PrismaToElasticQueryBuilder